export interface FAQItem {
    id: string;
    question: string;
    answer: React.ReactNode;
}

export interface InfoCardItem {
    id: string;
    subtitle: string;
    title?: string;
    description?: string;
}