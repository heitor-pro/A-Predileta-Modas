import { Link } from 'react-router-dom';
import { KeyRound } from 'lucide-react';
import { Card } from '@/components/ui/Card';

// Configurações administrativas. O número de WhatsApp e as regras de frete
// são definidos por variáveis de ambiente / arquivo de configuração (ver documentação),
// para manter a segurança e evitar edição acidental sem deploy.
export function SettingsPage() {
  return (
    <div className="max-w-xl space-y-6">
      <h1 className="font-display text-3xl italic">Configurações</h1>

      <Card className="p-5">
        <div className="flex items-center gap-3">
          <KeyRound size={20} className="text-silver-400" />
          <div>
            <p className="font-medium">Senha de acesso</p>
            <p className="text-sm text-silver-500">Altere sua senha de administrador quando quiser.</p>
          </div>
        </div>
        <Link
          to="/admin/redefinir-senha"
          className="mt-4 inline-block rounded-full border border-silver-300 dark:border-silver-700 px-4 py-2 text-sm"
        >
          Alterar senha
        </Link>
      </Card>

      <Card className="p-5 text-sm text-silver-500">
        <p className="font-medium text-ink dark:text-paper mb-1">Número de WhatsApp da loja</p>
        <p>
          Definido pela variável <code>VITE_WHATSAPP_NUMBER</code> no arquivo <code>.env</code>.
          Para alterar, edite o arquivo e faça um novo deploy (veja o README).
        </p>
      </Card>

      <Card className="p-5 text-sm text-silver-500">
        <p className="font-medium text-ink dark:text-paper mb-1">Regras de frete</p>
        <p>
          Definidas em <code>src/utils/shipping-rules.ts</code>. Edite as faixas de CEP e valores
          conforme necessário.
        </p>
      </Card>
    </div>
  );
}
