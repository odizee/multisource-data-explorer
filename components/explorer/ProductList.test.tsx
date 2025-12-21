import { render, screen } from '@testing-library/react';
import { ProductList } from './ProductList';

jest.mock('next/link', () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  );
});

jest.mock('next/image', () => {
  return ({ src, alt }: { src: string; alt: string }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src as string} alt={alt as string} />
  );
});

jest.mock('@/hooks/useDataFetcher', () => ({
  useDataFetcher: jest.fn(),
}));

const { useDataFetcher } = jest.requireMock('@/hooks/useDataFetcher');

const makeProducts = (count: number): any[] =>
  Array.from({ length: count }).map((_, i) => ({
    id: i + 1,
    title: `Product ${i + 1}`,
    price: 10 + i,
    description: `Description ${i + 1}`,
    category: i % 2 === 0 ? 'electronics' : 'clothing',
    image: 'https://example.com/image.png',
    rating: { rate: 4.5, count: 10 + i },
  }));

describe('ProductList', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders first page of products and shows formatted price', () => {
    const products = makeProducts(7);
    (useDataFetcher as jest.Mock).mockReturnValue({
      data: products,
      loading: false,
      error: null,
      refetch: jest.fn(),
    });

    render(
      <ProductList
        searchQuery=""
        isEnabled
        onToggle={jest.fn()}
      />
    );

    // Only first 5 items should be rendered (ITEMS_PER_PAGE = 5)
    for (let i = 1; i <= 5; i++) {
      expect(screen.getByText(`Product ${i}`)).toBeInTheDocument();
    }
    // Price formatting
    expect(screen.getByText('$10.00')).toBeInTheDocument();
  });

  it('filters products by search query across title and category', () => {
    const products = [
      {
        id: 1,
        title: 'Laptop Pro',
        price: 999.99,
        description: 'High-end laptop',
        category: 'Electronics',
        image: 'https://example.com/image.png',
        rating: { rate: 4.8, count: 100 },
      },
      {
        id: 2,
        title: 'Winter Jacket',
        price: 199.99,
        description: 'Warm jacket',
        category: 'Clothing',
        image: 'https://example.com/image.png',
        rating: { rate: 4.2, count: 50 },
      },
    ];
    (useDataFetcher as jest.Mock).mockReturnValue({
      data: products,
      loading: false,
      error: null,
      refetch: jest.fn(),
    });

    render(
      <ProductList
        searchQuery="electronics"
        isEnabled
        onToggle={jest.fn()}
      />
    );

    expect(screen.getByText('Laptop Pro')).toBeInTheDocument();
    expect(screen.queryByText('Winter Jacket')).not.toBeInTheDocument();
  });

  it('shows empty state when no products match', () => {
    const products = makeProducts(3);
    (useDataFetcher as jest.Mock).mockReturnValue({
      data: products,
      loading: false,
      error: null,
      refetch: jest.fn(),
    });

    render(
      <ProductList
        searchQuery="zzz"
        isEnabled
        onToggle={jest.fn()}
      />
    );

    expect(screen.getByText('No products found')).toBeInTheDocument();
  });

  it('shows disabled state when dataset is disabled', () => {
    (useDataFetcher as jest.Mock).mockReturnValue({
      data: null,
      loading: false,
      error: null,
      refetch: jest.fn(),
    });

    render(
      <ProductList
        searchQuery=""
        isEnabled={false}
        onToggle={jest.fn()}
      />
    );

    expect(screen.getByText('Dataset disabled')).toBeInTheDocument();
  });
});

