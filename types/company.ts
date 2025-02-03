export interface Company {
  name: string;
  webpage: string;
  stiftelsesdato: string;
  ansatte: number;
  businessType: string;
}

export interface BrregCompany {
  organisasjonsnummer: string;
  navn: string;
  antallAnsatte: string;
  stiftelsesdato: string;
  hjemmeside?: string;
  naeringskode1?: { beskrivelse: string };
  beliggenhetsadresse?: {
      postnummer: string;
      poststed: string;
  };
  konkurs: boolean;
  underAvvikling: boolean;
  underTvangsavviklingEllerTvangsopplosning: boolean;
}