import { RichText } from '@/components/rich-text';
import {
  Accordion,
  AccordionContent,
  AccordionHeader,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import type { PayloadFooterGlobal } from '@/payload/payload-types';

export default function FaqAccordion({ faqs }: { faqs: PayloadFooterGlobal['faqs'] }) {
  const faqsArray = faqs?.filter((faq) => typeof faq !== 'string');

  if (!faqsArray?.length) {
    return null;
  }

  return (
    <Accordion multiple={faqsArray.length > 1}>
      {faqsArray.map((faq) => (
        <AccordionItem value={faq.id} key={faq.id}>
          <AccordionHeader
            // oxlint-disable-next-line jsx-a11y/heading-has-content
            render={<h2 />}
            className="font-sans"
          >
            <AccordionTrigger>{faq.question}</AccordionTrigger>
          </AccordionHeader>
          <AccordionContent>
            <RichText data={faq.answer} />
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
