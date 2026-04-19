export const DEFAULT_WHATSAPP_NUMBER = '+91 96651 04053';

const normalizePhoneNumber = (phone) => String(phone || '').replace(/[^\d]/g, '');

export const buildWhatsAppLink = ({ phone, storeName, items, total }) => {
  const number = normalizePhoneNumber(phone || DEFAULT_WHATSAPP_NUMBER);
  const lines = [
    `Hello ${storeName || 'Store'},`,
    'I would like to place this order:',
    '',
    ...items.map((item, index) => {
      const lineTotal = Number(item.price) * Number(item.qty);
      return `${index + 1}. ${item.name} x ${item.qty} = ${lineTotal.toLocaleString()}`;
    }),
    '',
    `Subtotal: ${Number(total || 0).toLocaleString()}`,
    '',
    'Please confirm availability and delivery details.'
  ];

  return `https://wa.me/${number}?text=${encodeURIComponent(lines.join('\n'))}`;
};
