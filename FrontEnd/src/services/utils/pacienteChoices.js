// Opciones para los formularios de pacientes basadas en choices.py del backend

export const DOC_CHOICES = [
  { value: 'CC', label: 'Cédula de Ciudadanía' },
  { value: 'TI', label: 'Tarjeta de Identidad' },
  { value: 'RC', label: 'Registro Civil de Nacimiento' },
  { value: 'PS', label: 'Pasaporte' },
];

export const SEX_CHOICES = [
  { value: 'M', label: 'Masculino' },
  { value: 'F', label: 'Femenino' },
  { value: 'NA', label: 'No Aplica' }
];

export const REGIMEN_EPS_CHOICES = [
  { value: 'REGIMEN_CONTRIBUTIVO', label: 'Régimen Contributivo' },
  { value: 'REGIMEN_SUBSIDIADO', label: 'Régimen Subsidiado' },
  { value: 'NO_AFILIADO', label: 'No Afiliado' },
];

export const EPS_CHOICES = [
  { value: 'COOSALUD', label: 'COOSALUD' },
  { value: 'NUEVA_EPS', label: 'NUEVA EPS' },
  { value: 'MUTUAL_SER', label: 'MUTUAL SER' },
  { value: 'SALUD_MIA', label: 'SALUD MIA' },
  { value: 'ALIANSALUD', label: 'ALIANSALUD EPS' },
  { value: 'SALUD_TOTAL', label: 'SALUD TOTAL EPS S.A.' },
  { value: 'SANITAS', label: 'EPS SANITAS' },
  { value: 'SURA', label: 'EPS SURA' },
  { value: 'FAMISANAR', label: 'FAMISANAR' },
  { value: 'SOS', label: 'SERVICIO OCCIDENTAL DE SALUD EPS SOS' },
  { value: 'COMFENALCO_VALLE', label: 'COMFENALCO VALLE' },
  { value: 'COMPENSAR', label: 'COMPENSAR EPS' },
  { value: 'EPM', label: 'EPM - EMPRESAS PUBLICAS DE MEDELLIN' },
  { value: 'FONDO_PASIVO_FERROCARRILES', label: 'FONDO DE PASIVO SOCIAL DE FERROCARRILES NACIONALES DE COLOMBIA' },
  { value: 'CAJACOPI_ATLANTICO', label: 'CAJACOPI ATLANTICO' },
  { value: 'CAPRESOCA', label: 'CAPRESOCA' },
  { value: 'COMFACHOCO', label: 'COMFACHOCO' },
  { value: 'COMFAORIENTE', label: 'COMFAORIENTE' },
  { value: 'EPS_FAMILIAR', label: 'EPS FAMILIAR DE COLOMBIA' },
  { value: 'ASMET_SALUD', label: 'ASMET SALUD' },
  { value: 'EMSSANAR', label: 'EMSSANAR E.S.S.' },
  { value: 'CAPITAL_SALUD', label: 'CAPITAL SALUD EPS-S' },
  { value: 'SAVIA_SALUD', label: 'SAVIA SALUD EPS' },
  { value: 'DUSAKAWI', label: 'DUSAKAWI EPSI' },
  { value: 'ASOCIACION_INDIGENA_CAUCA', label: 'ASOCIACION INDIGENA DEL CAUCA EPSI' },
  { value: 'ANAS_WAYUU', label: 'ANAS WAYUU EPSI' },
  { value: 'MALLAMAS', label: 'MALLAMAS EPSI' },
  { value: 'PIJAOS_SALUD', label: 'PIJAOS SALUD EPSI' },
  { value: 'NO_AFILIADO', label: 'NO AFILIADO' },
];

export const PREFIJOS_TELEFONICOS = [
  { value: '+57', label: '+57 (Colombia)' },
  { value: '+1', label: '+1 (Estados Unidos/Canadá)' },
  { value: '+34', label: '+34 (España)' },
  { value: '+58', label: '+58 (Venezuela)' },
  { value: '+593', label: '+593 (Ecuador)' },
  { value: '+51', label: '+51 (Perú)' },
  { value: '+55', label: '+55 (Brasil)' },
  { value: '+507', label: '+507 (Panamá)' },
  { value: '+506', label: '+506 (Costa Rica)' },
  { value: '+52', label: '+52 (México)' },
];

export const SEGUROS_MEDICOS_CHOICES = [
  { value: '', label: 'No tiene seguro médico privado' },
  { value: 'COLSANITAS', label: 'Colsanitas' },
  { value: 'SURA', label: 'Sura' },
  { value: 'BOLIVAR', label: 'Seguros Bolívar' },
  { value: 'AXA_COLPATRIA', label: 'AXA Colpatria' },
  { value: 'LIBERTY', label: 'Liberty Seguros' },
  { value: 'MAPFRE', label: 'Mapfre' },
  { value: 'PREVISORA', label: 'La Previsora' },
  { value: 'MUNDIAL', label: 'Seguros Mundial' },
  { value: 'OTRO', label: 'Otro' },
];

export const RELACION_PARENTESCO_CHOICES = [
  { value: 'PADRE', label: 'Padre' },
  { value: 'MADRE', label: 'Madre' },
  { value: 'HIJO', label: 'Hijo/a' },
  { value: 'HERMANO', label: 'Hermano/a' },
  { value: 'ABUELO', label: 'Abuelo/a' },
  { value: 'TIO', label: 'Tío/a' },
  { value: 'PRIMO', label: 'Primo/a' },
  { value: 'ESPOSO', label: 'Esposo/a' },
  { value: 'NOVIO', label: 'Novio/a' },
  { value: 'CUÑADO', label: 'Cuñado/a' },
  { value: 'SUEGRO', label: 'Suegro/a' },
  { value: 'YERNO', label: 'Yerno/Nuera' },
  { value: 'AMIGO', label: 'Amigo/a' },
  { value: 'OTRO', label: 'Otro' },
];
