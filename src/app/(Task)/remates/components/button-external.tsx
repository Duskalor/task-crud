import { buttonVariants } from '@/components/ui/button';

const URL = 'https://remaju.pj.gob.pe/remaju/pages/publico/remateExterno.xhtml';

export const ButtonExternal = ({ text }: { text: string }) => {
  const codigo = text.match(/\d+/g) ?? '';
  const handleClick = () => {
    navigator.clipboard.writeText(codigo[0]);
  };

  return (
    <div
      onClick={handleClick}
      className={buttonVariants({ variant: 'default' })}
    >
      <a href={URL} target='_blank'>
        Ver detalles
      </a>
    </div>
  );
};
