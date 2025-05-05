import json
from collections import defaultdict

# Map Python types to JSON type names
TYPE_MAP = {
    dict: 'dict',
    list: 'list',
    str: 'string',
    bool: 'boolean',
    int: 'number',
    float: 'number',
    type(None): 'null'
}

class Node:
    def __init__(self):
        self.count = 0
        self.types = set()
        self.children = defaultdict(Node)


def get_type(value):
    """Return JSON type name for a Python value."""
    return TYPE_MAP.get(type(value), 'unknown')


def traverse(element, node):
    """
    Walk the JSON element, updating counts, types, and children in the tree.
    """
    if isinstance(element, dict):
        for key, value in element.items():
            child = node.children[key]
            child.count += 1
            child.types.add(get_type(value))
            traverse(value, child)
    elif isinstance(element, list):
        for item in element:
            traverse(item, node)


def collect_paths(node, prefix, root_count, parent_count):
    """
    Build a list of (path, count, is_optional, types_str) for each node.
    """
    results = []
    types_list = sorted(node.types)
    types_str = f" [{', '.join(types_list)}]" if types_list else ''
    path_label = prefix or '/'
    optional = node.count < parent_count
    opt_str = " optional" if optional else ''
    results.append((path_label, node.count, opt_str, types_str))

    for key, child in node.children.items():
        new_prefix = key if not prefix or prefix == '/' else f"{prefix}.{key}"
        results.extend(collect_paths(child, new_prefix, root_count, node.count))
    return results


def main():
    # Path to your JSON file
    input_file = "script/example.json"

    # Load JSON
    with open(input_file, 'r', encoding='utf-8') as f:
        data = json.load(f)

    # Ensure we have a list of top-level items
    items = data if isinstance(data, list) else [data]

    # Build the tree
    root = Node()
    root.count = len(items)
    root.types.add(get_type(data))
    for item in items:
        traverse(item, root)

    # Collect and print paths with counts and optional flag
    rows = collect_paths(root, '/', root.count, root.count)
    for path, count, opt_str, types_str in rows:
        print(f"{path} ({count} occurrences){opt_str}{types_str}")


if __name__ == '__main__':
    main()
