import capitalize from 'capitalize';

function snakeCaseToCapitalize(text: string) {
  return text
    .split('_')
    .map((t) => capitalize(t))
    .join(' ');
}

export {snakeCaseToCapitalize}
