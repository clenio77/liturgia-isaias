// Sistema de Validação de Datas Litúrgicas
// Garante que as leituras correspondem à data correta

import { DailyReadings } from './liturgical-readings';

export interface DateValidationResult {
  isValid: boolean;
  expectedDate: string;
  actualDate: string;
  issues: string[];
  suggestions: string[];
}

// Função principal para validar se as leituras correspondem à data
export function validateReadingsDate(readings: DailyReadings, expectedDate: Date): DateValidationResult {
  const expectedDateStr = expectedDate.toISOString().split('T')[0];
  const actualDateStr = readings.date;
  
  const issues: string[] = [];
  const suggestions: string[] = [];
  
  // 1. Verificar se as datas coincidem
  if (expectedDateStr !== actualDateStr) {
    issues.push(`Data das leituras (${actualDateStr}) não coincide com data solicitada (${expectedDateStr})`);
    suggestions.push('Verificar se o sistema está buscando a data correta');
  }
  
  // 2. Verificar se é um dia especial conhecido
  const specialDay = getSpecialDay(expectedDate);
  if (specialDay) {
    const celebrationMatch = readings.celebration.toLowerCase().includes(specialDay.name.toLowerCase());
    if (!celebrationMatch) {
      issues.push(`Celebração "${readings.celebration}" não corresponde ao dia especial "${specialDay.name}"`);
      suggestions.push(`Deveria ser "${specialDay.name}"`);
    }
  }
  
  // 3. Verificar tempo litúrgico
  const expectedSeason = getExpectedLiturgicalSeason(expectedDate);
  if (expectedSeason && !readings.season.toLowerCase().includes(expectedSeason.toLowerCase())) {
    issues.push(`Tempo litúrgico "${readings.season}" pode estar incorreto. Esperado: "${expectedSeason}"`);
    suggestions.push(`Verificar se estamos no ${expectedSeason}`);
  }
  
  // 4. Verificar cor litúrgica
  const expectedColor = getExpectedLiturgicalColor(expectedDate, readings.season);
  if (expectedColor && readings.color !== expectedColor) {
    issues.push(`Cor litúrgica "${readings.color}" pode estar incorreta. Esperado: "${expectedColor}"`);
    suggestions.push(`Cor deveria ser "${expectedColor}" para ${readings.season}`);
  }
  
  // 5. Verificar se as leituras fazem sentido para o dia da semana
  const dayOfWeek = expectedDate.getDay();
  const dayValidation = validateDayOfWeek(readings, dayOfWeek);
  if (!dayValidation.isValid) {
    issues.push(...dayValidation.issues);
    suggestions.push(...dayValidation.suggestions);
  }
  
  return {
    isValid: issues.length === 0,
    expectedDate: expectedDateStr,
    actualDate: actualDateStr,
    issues,
    suggestions
  };
}

// Função para obter dias especiais conhecidos
function getSpecialDay(date: Date): { name: string; type: string } | null {
  const month = date.getMonth() + 1;
  const day = date.getDate();
  
  const specialDays: Record<string, { name: string; type: string }> = {
    '1-1': { name: 'Santa Maria, Mãe de Deus', type: 'solemnity' },
    '1-6': { name: 'Epifania do Senhor', type: 'solemnity' },
    '3-19': { name: 'São José', type: 'solemnity' },
    '3-25': { name: 'Anunciação do Senhor', type: 'solemnity' },
    '6-24': { name: 'Nascimento de São João Batista', type: 'solemnity' },
    '6-29': { name: 'Santos Pedro e Paulo', type: 'solemnity' },
    '8-15': { name: 'Assunção de Nossa Senhora', type: 'solemnity' },
    '10-12': { name: 'Nossa Senhora Aparecida', type: 'solemnity' },
    '11-1': { name: 'Todos os Santos', type: 'solemnity' },
    '11-2': { name: 'Finados', type: 'memorial' },
    '12-8': { name: 'Imaculada Conceição', type: 'solemnity' },
    '12-25': { name: 'Natal do Senhor', type: 'solemnity' }
  };
  
  const key = `${month}-${day}`;
  return specialDays[key] || null;
}

// Função para obter tempo litúrgico esperado
function getExpectedLiturgicalSeason(date: Date): string | null {
  const month = date.getMonth() + 1;
  const day = date.getDate();
  
  // Tempo do Natal (aproximado)
  if ((month === 12 && day >= 25) || (month === 1 && day <= 13)) {
    return 'Tempo do Natal';
  }
  
  // Tempo Pascal (aproximado - varia por ano)
  if (month >= 3 && month <= 5) {
    // Verificação mais precisa seria necessária com cálculo da Páscoa
    return null; // Não validar por enquanto
  }
  
  // Advento (aproximado)
  if (month === 12 && day < 25) {
    return 'Advento';
  }
  
  // Tempo Comum (padrão)
  return 'Tempo Comum';
}

// Função para obter cor litúrgica esperada
function getExpectedLiturgicalColor(date: Date, season: string): string | null {
  const specialDay = getSpecialDay(date);
  
  if (specialDay) {
    if (specialDay.type === 'solemnity') {
      return 'branco'; // Maioria das solenidades
    }
  }
  
  switch (season.toLowerCase()) {
    case 'tempo do natal':
    case 'tempo pascal':
      return 'branco';
    case 'quaresma':
    case 'advento':
      return 'roxo';
    case 'tempo comum':
      return 'verde';
    default:
      return null;
  }
}

// Função para validar dia da semana
function validateDayOfWeek(readings: DailyReadings, dayOfWeek: number): { isValid: boolean; issues: string[]; suggestions: string[] } {
  const issues: string[] = [];
  const suggestions: string[] = [];
  
  const dayNames = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'];
  const expectedDayName = dayNames[dayOfWeek];
  
  const celebrationLower = readings.celebration.toLowerCase();
  
  // Verificar se a celebração menciona o dia correto (para dias de semana)
  if (dayOfWeek !== 0 && !celebrationLower.includes('solenidade') && !celebrationLower.includes('festa')) {
    if (!celebrationLower.includes(expectedDayName)) {
      issues.push(`Celebração não menciona "${expectedDayName}" como esperado`);
      suggestions.push(`Verificar se é realmente ${expectedDayName}`);
    }
  }
  
  // Domingo deveria ter leituras especiais
  if (dayOfWeek === 0) {
    if (!celebrationLower.includes('domingo') && !celebrationLower.includes('solenidade')) {
      issues.push('Domingo deveria ter celebração especial');
      suggestions.push('Verificar se há leituras dominicais específicas');
    }
  }
  
  return {
    isValid: issues.length === 0,
    issues,
    suggestions
  };
}

// Função para comparar leituras com referência conhecida
export function compareWithReference(readings: DailyReadings, referenceSource: string): string[] {
  const differences: string[] = [];
  
  // Esta função seria expandida para comparar com fontes de referência
  // Por enquanto, apenas log para debug
  console.log(`📊 Comparando leituras com ${referenceSource}:`, {
    date: readings.date,
    celebration: readings.celebration,
    readingsCount: readings.readings.length,
    references: readings.readings.map(r => r.reference)
  });
  
  return differences;
}

// Função para sugerir correções
export function suggestCorrections(validation: DateValidationResult): string[] {
  const corrections: string[] = [];
  
  if (!validation.isValid) {
    corrections.push('🔍 Verificar fonte das leituras (CNBB oficial)');
    corrections.push('📅 Confirmar data solicitada');
    corrections.push('🕐 Verificar fuso horário');
    corrections.push('💾 Limpar cache se necessário');
    
    if (validation.issues.some(issue => issue.includes('tempo litúrgico'))) {
      corrections.push('📖 Verificar calendário litúrgico atual');
    }
    
    if (validation.issues.some(issue => issue.includes('cor litúrgica'))) {
      corrections.push('🎨 Verificar cor litúrgica oficial');
    }
  }
  
  return corrections;
}

// Função para log detalhado de debug
export function logReadingsDebug(readings: DailyReadings, expectedDate: Date): void {
  console.log('🔍 DEBUG - Leituras Litúrgicas:', {
    expectedDate: expectedDate.toISOString().split('T')[0],
    actualDate: readings.date,
    celebration: readings.celebration,
    season: readings.season,
    color: readings.color,
    readingsCount: readings.readings.length,
    readings: readings.readings.map(r => ({
      type: r.type,
      reference: r.reference,
      textLength: r.text.length,
      textPreview: r.text.substring(0, 100) + '...'
    }))
  });
}
