import '@testing-library/jest-dom';

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
  }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
}));

// Mock Next.js Link component
jest.mock('next/link', () => {
  return function MockLink(props: any) {
    return null;
  };
});

// Mock Next.js Image component
jest.mock('next/image', () => {
  return function MockImage() {
    return null;
  };
}); 