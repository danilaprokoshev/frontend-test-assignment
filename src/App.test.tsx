import React from 'react';
import { render, screen, act } from '@testing-library/react';
import App from './App';
import { setupServer } from 'msw/node';
import { rest } from 'msw'

const server = setupServer(
  rest.get('http://localhost:3001/banks', (req, res, ctx) => {
      return res(ctx.json({
        banks:
          [
            {
              id: 1,
              title: 'Tinkoff',
              address: 'Moscow',
              IBAN: 'CH7689144497354555744',
              email: 'info@tinkoff.ru',
              'Found Date': '12.04.2004'
            },
          ]
      }))
    }
  )
)


beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

test('render spinning', () => {
  render(<App />);
  expect(screen.getByRole('status')).toBeInTheDocument();
});

test('renders fetched data', async () => {
  render(<App />);
  const IBANElement = screen.getByText('CH7689144497354555744');
  expect(IBANElement).toBeInTheDocument();
});
