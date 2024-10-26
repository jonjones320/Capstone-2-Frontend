import { useNavigate as actualUseNavigate } from 'react-router-dom';

const mockNavigate = jest.fn();

export const useNavigate = () => mockNavigate;
export const useParams = jest.fn();
export const useLocation = jest.fn(() => ({ state: {} }));
export const Link = ({ children, to, ...props }) => (
  <a href={to} {...props}>
    {children}
  </a>
);

// Re-export the actual BrowserRouter
export { BrowserRouter } from 'react-router-dom';

export default {
  useNavigate,
  useParams,
  useLocation,
  Link,
  BrowserRouter
};