#!/usr/bin/env python
import json
import optparse
import os
import sys
import traceback
import urllib
import urlparse

import requests


class InventoryScript(object):

    def __init__(self, **options):
        self.options = options

    def get_data(self):
        response = requests.post(self.url, {'taskInstanceId': self.inventory_id})
        response.raise_for_status()
        sys.stdout.write(json.dumps(json.loads(response.content),
                                    indent=self.indent) + '\n')

    def run(self):
        try:
            self.url = self.options.get('base_url', '') or \
                os.getenv('INVENTORY_URL', '')
            if not self.url:
                raise ValueError('No INVENTORY URL specified')
            try:
                # Command line argument takes precedence over environment
                # variable.
                self.inventory_id = int(self.options.get('inventory_id', 0) or
                                        os.getenv('INVENTORY_ID', 0))
            except ValueError:
                raise ValueError('Inventory ID must be an integer')
            if not self.inventory_id:
                raise ValueError('No inventory ID specified')
            self.hostname = self.options.get('hostname', '')
            self.list_ = self.options.get('list', False)
            self.hostvars = bool(self.options.get('hostvars', False) or
                                 os.getenv('INVENTORY_HOSTVARS', ''))
            self.show_all = bool(self.options.get('show_all', False) or
                                 os.getenv('INVENTORY_ALL', ''))
            self.indent = self.options.get('indent', None)
            if self.list_ and self.hostname:
                raise RuntimeError('Only --list or --host may be specified')
            elif self.list_ or self.hostname:
                self.get_data()
            else:
                raise RuntimeError('Either --list or --host must be specified')
        except Exception, e:
            sys.stdout.write('%s\n' % json.dumps(dict(failed=True)))
            if self.options.get('traceback', False):
                sys.stderr.write(traceback.format_exc())
            else:
                sys.stderr.write('%s\n' % str(e))
            if hasattr(e, 'response'):
                if hasattr(e.response, 'content'):
                    sys.stderr.write('%s\n' % e.response.content)
                else:
                    sys.stderr.write('%s\n' % e.response)
            sys.exit(1)

def main():
    parser = optparse.OptionParser()
    parser.add_option('-v', '--verbosity', action='store', dest='verbosity',
                      default='1', type='choice', choices=['0', '1', '2', '3'],
                      help='Verbosity level; 0=minimal output, 1=normal output'
                      ', 2=verbose output, 3=very verbose output')
    parser.add_option('--traceback', action='store_true',
                      help='Raise on exception on error')
    parser.add_option('-u', '--url', dest='base_url', default='',
                      help='Base URL to access REST API, including username '
                      'and password for authentication (can also be specified'
                      ' using REST_API_URL environment variable)')
    parser.add_option('--authtoken', dest='authtoken', default='',
                      help='Authentication token used to access REST API (can '
                      'also be specified using REST_API_TOKEN environment '
                      'variable)')
    parser.add_option('-i', '--inventory', dest='inventory_id', type='int',
                      default=0, help='Inventory ID (can also be specified '
                      'using INVENTORY_ID environment variable)')
    parser.add_option('--list', action='store_true', dest='list',
                      default=False, help='Return JSON hash of host groups.')
    parser.add_option('--hostvars', action='store_true', dest='hostvars',
                      default=False, help='Return hostvars inline with --list,'
                      ' under ["_meta"]["hostvars"]. Can also be specified '
                      'using INVENTORY_HOSTVARS environment variable.')
    parser.add_option('--all', action='store_true', dest='show_all',
                      default=False, help='Return all hosts, including those '
                      'marked as offline/disabled. Can also be specified '
                      'using INVENTORY_ALL environment variable.')
    parser.add_option('--host', dest='hostname', default='',
                      help='Return JSON hash of host vars.')
    parser.add_option('--indent', dest='indent', type='int', default=None,
                      help='Indentation level for pretty printing output')
    options, args = parser.parse_args()
    InventoryScript(**vars(options)).run()

if __name__ == '__main__':
    main()

