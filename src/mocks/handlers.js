// MSW request handlers — shared between browser (dev) and Node (tests).
// Add/override handlers per test with server.use(http.get(...)) for edge cases.
import { http, HttpResponse } from 'msw';

export const handlers = [
  // --- Auth ---
  http.post('*/users/auth', () =>
    HttpResponse.json({
      data: {
        token: 'mock-access-token',
        refresh_token: 'mock-refresh-token',
        user: { id: 1, email: 'user@example.com', role: 'user', permissions: ['transactions:read'] },
      },
    })
  ),

  http.post('*/users/refresh', () =>
    HttpResponse.json({
      data: { token: 'mock-access-token-refreshed', refresh_token: 'mock-refresh-token-2' },
    })
  ),

  // --- Categories ---
  http.get('*/categories', () =>
    HttpResponse.json({
      data: {
        categories: [
          { id: 1, name: 'Food', status: 1 },
          { id: 2, name: 'Transport', status: 1 },
          { id: 3, name: 'Utilities', status: 1 },
        ],
      },
    })
  ),

  http.post('*/categories', async ({ request }) => {
    const body = await request.json();
    return HttpResponse.json({ data: { id: Date.now(), ...body } }, { status: 201 });
  }),

  http.put('*/categories/:id', async ({ params, request }) => {
    const body = await request.json();
    return HttpResponse.json({ data: { id: Number(params.id), ...body } });
  }),

  http.delete('*/categories/:id', () => new HttpResponse(null, { status: 204 })),

  // --- Transactions ---
  http.get('*/transactions', () =>
    HttpResponse.json({
      data: {
        transactions: [
          {
            id: 1,
            amount: 500,
            type: 'expense',
            category_id: 1,
            dated: '2024-01-15T00:00:00Z',
            recurring: 0,
          },
          {
            id: 2,
            amount: 5000,
            type: 'income',
            category_id: null,
            dated: '2024-01-10T00:00:00Z',
            recurring: 1,
          },
        ],
        stats: { income: 5000, expense: 500, balance: 4500 },
      },
    })
  ),

  http.post('*/transactions', async ({ request }) => {
    const body = await request.json();
    return HttpResponse.json({ data: { id: Date.now(), ...body } }, { status: 201 });
  }),

  http.put('*/transactions/:id', async ({ params, request }) => {
    const body = await request.json();
    return HttpResponse.json({ data: { id: Number(params.id), ...body } });
  }),

  http.delete('*/transactions/:id', () => new HttpResponse(null, { status: 204 })),
];
