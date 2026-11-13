export function weatherIcon(description: string) {
  const text = description.toLocaleLowerCase('pt-BR');
  if (/trovo|trovão|tempestade/.test(text)) return 'cloud-lightning' as const;
  if (/chuva|chuvisco|garoa/.test(text)) return 'cloud-rain' as const;
  if (/neve|nevasca/.test(text)) return 'cloud-snow' as const;
  if (/sol|limpo/.test(text)) return 'sun' as const;
  return 'cloud' as const;
}

export function weatherStudyTip(chanceOfRain: number, maxTemperature: number) {
  if (chanceOfRain >= 50)
    return 'Guarda-chuva na mochila: há chance de chuva. Reserve uma folga para chegar à aula.';
  if (maxTemperature >= 30)
    return 'Dia quente pela frente. Leve água e planeje seu trajeto até a aula.';
  return 'Confira os horários das suas aulas e deixe o material separado antes de sair.';
}

export function weatherDate(date: string) {
  const [year, month, day] = date.split('-').map(Number);
  return new Date(year, month - 1, day, 12).toLocaleDateString('pt-BR', {
    weekday: 'short',
    day: '2-digit',
    month: '2-digit',
  });
}
