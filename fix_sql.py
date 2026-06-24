import sys

def fix_sql_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Replace the literal characters '\' and 'n' with an actual newline
    content = content.replace('\\n', '\n')
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

if __name__ == "__main__":
    fix_sql_file('supabase_schema.sql')
