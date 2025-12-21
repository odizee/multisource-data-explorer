import { NextResponse } from 'next/server';

const repos = [
  {
    id: 1001,
    name: 'bar',
    full_name: 'foo/bar',
    owner: { login: 'foo', avatar_url: '', html_url: '' },
    html_url: 'https://github.com/foo/bar',
    description: 'Test repository',
    stargazers_count: 1234,
    language: 'TypeScript',
    forks_count: 567,
    open_issues_count: 1,
    updated_at: '2023-01-01T00:00:00Z',
  },
  {
    id: 1002,
    name: 'qux',
    full_name: 'baz/qux',
    owner: { login: 'baz', avatar_url: '', html_url: '' },
    html_url: 'https://github.com/baz/qux',
    description: null,
    stargazers_count: 999,
    language: null,
    forks_count: 10,
    open_issues_count: 0,
    updated_at: '2023-01-02T00:00:00Z',
  },
];

export async function GET() {
  return NextResponse.json({
    total_count: repos.length,
    incomplete_results: false,
    items: repos,
  });
}

