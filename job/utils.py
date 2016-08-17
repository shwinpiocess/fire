import subprocess

def get_ansible_version():
    """
    Return Ansible version installed.
    """
    try:
        proc = subprocess.Popen(['ansible', '--version'], stdout=subprocess.PIPE)
        result = proc.communicate()[0]
        stripped_result = result.lower().replace('ansible', '').strip()
        return stripped_result.split('\n', 1)[0]
    except:
        return 'unknown'