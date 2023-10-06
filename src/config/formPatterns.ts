export const emailPattern = {
  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
  message: 'Введите корректный почтовый адрес'
};

export const imagePattern = {
  value: /.*\.(jpe?g|bmp|png|svg|webp)$/gim,
  message: 'Неккоректный формат изображения'
};
