from typing import Any, List, Dict, Set, Tuple, Union
import httpx
import ipaddress
import json
from mcp.server.fastmcp import FastMCP

# Initialize FastMCP server
mcp = FastMCP("aws-ip-lookup-tool")

# Constants
AWS_OFFICIAL_IP_RANGES = "https://ip-ranges.amazonaws.com/ip-ranges.json"


# Helper Functions
def is_valid_ip(ip: str) -> bool:
    """
    Validate if a string is a valid IPv4 address.
    
    Args:
        ip: String to validate as IP address
        
    Returns:
        True if valid IPv4 address, False otherwise
    """
    try:
        ipaddress.IPv4Address(ip.strip())
        return True
    except (ipaddress.AddressValueError, ValueError):
        return False


def is_ip_in_cidr_range(ip: str, cidr: str) -> bool:
    """
    Check if an IP address is within a CIDR range.
    
    Args:
        ip: IP address to check
        cidr: CIDR range (e.g., "192.168.1.0/24")
        
    Returns:
        True if IP is in range, False otherwise
    """
    try:
        ip_addr = ipaddress.IPv4Address(ip.strip())
        network = ipaddress.IPv4Network(cidr.strip(), strict=False)
        return ip_addr in network
    except (ipaddress.AddressValueError, ipaddress.NetmaskValueError, ValueError):
        return False


def parse_ip_input(ips: Union[str, List[str]]) -> List[str]:
    """
    Parse input containing one or more IP addresses.
    
    Args:
        ips: String containing IP addresses (comma-separated or newline-separated) 
             or List of IP address strings
        
    Returns:
        List of cleaned IP addresses
    """
    if not ips:
        return []
    
    # If it's already a list, clean and return it
    if isinstance(ips, list):
        ip_list = []
        for ip in ips:
            if isinstance(ip, str) and ip.strip():
                cleaned_ip = ip.strip()
                if len(cleaned_ip) >= 7 and len(cleaned_ip) <= 15:  # Basic length check
                    ip_list.append(cleaned_ip)
        return ip_list
    
    # If it's a string, parse it as before
    if not isinstance(ips, str):
        return []
    
    # Clean the input string
    ips = ips.strip()
    if not ips:
        return []
    
    # Split by multiple possible separators and clean up
    ip_list = []
    
    # Try different separators in order of preference
    separators = [',', '\n', ';', ' ']
    
    for separator in separators:
        if separator in ips:
            # Split and clean each IP
            potential_ips = [ip.strip() for ip in ips.split(separator)]
            # Filter out empty strings and invalid characters
            ip_list = [ip for ip in potential_ips if ip and len(ip) >= 7 and len(ip) <= 15]
            if ip_list:  # If we found valid IPs, use this separator
                break
    else:
        # Single IP case
        if len(ips) >= 7 and len(ips) <= 15:  # Basic length check for IP
            ip_list = [ips]
    
    return ip_list


async def fetch_aws_ip_ranges() -> Dict[str, Any]:
    """
    Fetch the latest AWS IP ranges from the official endpoint.
    
    Returns:
        Dictionary containing AWS IP ranges data
        
    Raises:
        httpx.RequestError: If the request fails
        json.JSONDecodeError: If the response is not valid JSON
    """
    async with httpx.AsyncClient(timeout=30.0) as client:
        response = await client.get(AWS_OFFICIAL_IP_RANGES)
        response.raise_for_status()
        return response.json()


def find_ip_matches(ip: str, aws_data: Dict[str, Any]) -> Tuple[Set[str], Set[str], List[str]]:
    """
    Find all AWS services, regions, and ranges that contain the given IP.
    
    Args:
        ip: IP address to search for
        aws_data: AWS IP ranges data from the official endpoint
        
    Returns:
        Tuple of (services, regions, ranges) that contain the IP
    """
    services = set()
    regions = set()
    ranges = []
    
    # Check IPv4 prefixes
    for prefix_info in aws_data.get('prefixes', []):
        ip_prefix = prefix_info.get('ip_prefix')
        if ip_prefix and is_ip_in_cidr_range(ip, ip_prefix):
            services.add(prefix_info.get('service', 'UNKNOWN'))
            regions.add(prefix_info.get('region', 'UNKNOWN'))
            ranges.append(ip_prefix)
    
    # Check IPv6 prefixes (if needed in the future)
    for prefix_info in aws_data.get('ipv6_prefixes', []):
        # Skip IPv6 for now as we're focusing on IPv4
        pass
    
    return services, regions, ranges


def format_ip_result(ip: str, services: Set[str], regions: Set[str], ranges: List[str], error: str = None) -> Dict[str, Any]:
    """
    Format the result for a single IP lookup.
    
    Args:
        ip: The IP address that was checked
        services: Set of AWS services using this IP
        regions: Set of AWS regions for this IP
        ranges: List of CIDR ranges containing this IP
        error: Error message if lookup failed
        
    Returns:
        Formatted result dictionary
    """
    is_aws = len(services) > 0 and not error
    
    result = {
        "ip": ip,
        "is_aws": is_aws,
        "services": sorted(list(services)) if services else [],
        "regions": sorted(list(regions)) if regions else [],
        "ranges": ranges if ranges else []
    }
    
    if error:
        result["error"] = error
    
    return result


def generate_summary_stats(results: List[Dict[str, Any]]) -> Dict[str, Any]:
    """
    Generate summary statistics for the lookup results.
    
    Args:
        results: List of individual IP lookup results
        
    Returns:
        Dictionary with summary statistics
    """
    total_checked = len(results)
    aws_count = sum(1 for result in results if result.get('is_aws', False))
    error_count = sum(1 for result in results if result.get('error'))
    
    # Collect all unique services and regions
    all_services = set()
    all_regions = set()
    
    for result in results:
        if result.get('is_aws', False):
            all_services.update(result.get('services', []))
            all_regions.update(result.get('regions', []))
    
    return {
        "total_checked": total_checked,
        "aws_count": aws_count,
        "non_aws_count": total_checked - aws_count - error_count,
        "error_count": error_count,
        "unique_services": sorted(list(all_services)),
        "unique_regions": sorted(list(all_regions))
    }


# MCP Tool Implementation
@mcp.tool()
async def check_aws_ip_ranges(ips: Union[str, List[str]]) -> Dict[str, Any]:
    """
    Check if IP addresses belong to AWS services by looking them up in AWS IP ranges.
    
    This tool fetches the latest AWS IP ranges and checks if the provided IP addresses
    belong to any AWS services. It supports single IPs, comma-separated strings, or lists.
    
    Args:
        ips: Single IP address, comma-separated list of IP addresses, or Python list of IPs
             Examples: 
             - "52.95.110.1" 
             - "52.95.110.1,54.239.28.85,8.8.8.8"
             - ["52.95.110.1", "54.239.28.85", "8.8.8.8"]
    
    Returns:
        Dictionary containing:
        - results: List of lookup results for each IP
        - summary: Summary statistics
        - metadata: Information about the AWS data source
    """
    try:
        # Parse input IPs (handles both strings and lists)
        ip_list = parse_ip_input(ips)
        
        if not ip_list:
            return {
                "results": [],
                "summary": {
                    "total_checked": 0,
                    "aws_count": 0,
                    "non_aws_count": 0,
                    "error_count": 1,
                    "unique_services": [],
                    "unique_regions": []
                },
                "metadata": {
                    "source": AWS_OFFICIAL_IP_RANGES,
                    "error": "No valid IP addresses provided"
                }
            }
        
        # Fetch AWS IP ranges
        try:
            aws_data = await fetch_aws_ip_ranges()
        except Exception as e:
            # Return error results for all IPs if we can't fetch AWS data
            error_results = []
            for ip in ip_list:
                error_results.append(format_ip_result(
                    ip, set(), set(), [], 
                    f"Failed to fetch AWS IP ranges: {str(e)}"
                ))
            
            return {
                "results": error_results,
                "summary": generate_summary_stats(error_results),
                "metadata": {
                    "source": AWS_OFFICIAL_IP_RANGES,
                    "error": f"Failed to fetch AWS data: {str(e)}"
                }
            }
        
        # Process each IP
        results = []
        for ip in ip_list:
            if not is_valid_ip(ip):
                results.append(format_ip_result(
                    ip, set(), set(), [], 
                    "Invalid IP address format"
                ))
                continue
            
            # Find matches for this IP
            services, regions, ranges = find_ip_matches(ip, aws_data)
            results.append(format_ip_result(ip, services, regions, ranges))
        
        # Generate summary statistics
        summary = generate_summary_stats(results)
        
        # Prepare metadata
        metadata = {
            "source": AWS_OFFICIAL_IP_RANGES,
            "sync_token": aws_data.get('syncToken', 'unknown'),
            "create_date": aws_data.get('createDate', 'unknown'),
            "total_aws_prefixes": len(aws_data.get('prefixes', [])),
            "total_aws_ipv6_prefixes": len(aws_data.get('ipv6_prefixes', []))
        }
        
        return {
            "results": results,
            "summary": summary,
            "metadata": metadata
        }
        
    except Exception as e:
        # Handle any unexpected errors
        return {
            "results": [],
            "summary": {
                "total_checked": 0,
                "aws_count": 0,
                "non_aws_count": 0,
                "error_count": 1,
                "unique_services": [],
                "unique_regions": []
            },
            "metadata": {
                "source": AWS_OFFICIAL_IP_RANGES,
                "error": f"Unexpected error: {str(e)}"
            }
        }

@mcp.tool()
async def test_connection() -> Dict[str, Any]:
    """
    Simple test tool to verify MCP server is working correctly.
    
    Returns:
        Dictionary with test result and server status
    """
    return {
        "status": "ok",
        "message": "AWS IP Lookup MCP server is running correctly",
        "server_name": "aws-ip-lookup-tool",
        "available_tools": ["check_aws_ip_ranges", "test_connection"]
    }


if __name__ == "__main__":
    try:
        # Run the MCP server
        mcp.run()
    except Exception as e:
        logging.error(f"Failed to start MCP server: {e}")
        raise