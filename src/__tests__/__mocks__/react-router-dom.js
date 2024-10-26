const mockNavigate = jest.fn();
const mockLocation = jest.fn(() => ({ state: {} }));
const mockParams = jest.fn();

const React = require('react');

const BrowserRouter = ({ children }) => <div>{children}</div>;
const Link = ({ children, to, ...props }) => (
  <a href={to} {...props}>{children}</a>
);

const ReactRouterDOM = {
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
  useParams: () => mockParams(),
  useLocation: () => mockLocation(),
  Link,
  BrowserRouter
};

module.exports = ReactRouterDOM;