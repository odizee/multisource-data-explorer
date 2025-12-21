import { render, screen } from '@testing-library/react';
import ProductPage from './page';
import { fakeStoreApi } from '@/lib/api/fakeStore';

jest.mock('@/lib/api/fakeStore', () => ({
  fakeStoreApi: {
    getProduct: jest.fn(),
  },
}));

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

describe('ProductPage', () => {
  const params = Promise.resolve({ id: '1' });

  const mockProduct = {
    id: 1,
    title: 'Test Product',
    price: 42.5,
    description: 'A great product for testing.',
    category: 'Electronics',
    image: 'https://example.com/product.png',
    rating: {
      rate: 4.7,
      count: 123,
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders product details correctly', async () => {
    (fakeStoreApi.getProduct as jest.Mock).mockResolvedValue(mockProduct);

    const resolvedParams = await params;
    const jsx = await ProductPage({ params: resolvedParams });
    render(jsx);

    expect(screen.getByText('Test Product')).toBeInTheDocument();
    expect(screen.getByText('$42.50')).toBeInTheDocument();
    expect(screen.getByText('Electronics')).toBeInTheDocument();
    expect(screen.getByText(/Add to Cart/i)).toBeInTheDocument();
    expect(screen.getByText(/4.7 \(123 reviews\)/)).toBeInTheDocument();
    expect(screen.getByText('Back to Explorer')).toBeInTheDocument();
  });

  it('renders error state when product fetch fails', async () => {
    (fakeStoreApi.getProduct as jest.Mock).mockRejectedValue(new Error('API Error'));

    const resolvedParams = await params;
    const jsx = await ProductPage({ params: resolvedParams });
    render(jsx);

    expect(screen.getByText('Error')).toBeInTheDocument();
    expect(screen.getByText('Failed to load product details')).toBeInTheDocument();
    expect(screen.getByText('Back to Explorer')).toBeInTheDocument();
  });
});

