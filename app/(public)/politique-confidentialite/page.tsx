import type { Metadata } from "next";
import Link from "next/link";
import { LandingHeader } from "@/components/landing-header";

export const metadata: Metadata = {
  title: "Politique de confidentialité",
  description:
    "Politique de confidentialité de FacturePro : données collectées, finalités, droits RGPD.",
};

export default function PolitiqueConfidentialitePage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <LandingHeader />
      <main className="mx-auto max-w-3xl px-4 py-16">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">
          Politique de confidentialité
        </h1>
        <p className="mt-2 text-slate-600">
          Dernière mise à jour : février 2026
        </p>

        <div className="mt-10 space-y-10 text-slate-700">
          <section>
            <h2 className="text-xl font-semibold text-slate-900">
              1. Responsable du traitement
            </h2>
            <p className="mt-2 leading-relaxed">
              Les données personnelles collectées via le site FacturePro sont
              traitées sous la responsabilité de FacturePro. Pour toute question
              relative à vos données, vous pouvez nous contacter via la page{" "}
              <Link href="/contact" className="text-emerald-600 hover:underline">
                Contact
              </Link>
              .
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900">
              2. Données collectées
            </h2>
            <p className="mt-2 leading-relaxed">
              Dans le cadre de l&apos;utilisation de FacturePro, nous sommes
              susceptibles de collecter les données suivantes :
            </p>
            <ul className="mt-3 list-inside list-disc space-y-1 pl-2">
              <li>
                <strong>Compte utilisateur :</strong> adresse e-mail, mot de
                passe (stocké de manière sécurisée et non lisible par nous).
              </li>
              <li>
                <strong>Profil entreprise :</strong> nom, adresse, e-mail,
                téléphone, numéro de TVA, logo, conditions de paiement, mentions
                légales que vous renseignez pour vos factures et devis.
              </li>
              <li>
                <strong>Clients :</strong> nom ou raison sociale, type (particulier
                ou entreprise), personne à contacter, adresse, e-mail,
                téléphone, SIRET ou SIREN que vous saisissez.
              </li>
              <li>
                <strong>Devis et factures :</strong> numéros, dates, montants,
                lignes, statuts et toute donnée que vous créez dans
                l&apos;application.
              </li>
              <li>
                <strong>Données techniques :</strong> adresse IP, identifiants de
                session (cookies ou stockage local) pour le bon fonctionnement
                de la connexion et de l&apos;application.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900">
              3. Finalités et base légale
            </h2>
            <p className="mt-2 leading-relaxed">
              Vos données sont utilisées pour :
            </p>
            <ul className="mt-3 list-inside list-disc space-y-1 pl-2">
              <li>créer et gérer votre compte et votre accès au service ;</li>
              <li>fournir les fonctionnalités de FacturePro (devis, factures,
                clients, export PDF) ;</li>
              <li>assurer la sécurité et le bon fonctionnement du site ;</li>
              <li>répondre à vos demandes envoyées via la page Contact.</li>
            </ul>
            <p className="mt-3 leading-relaxed">
              Le traitement repose sur l&apos;<strong>exécution du contrat</strong> (utilisation
              du service) et, le cas échéant, sur notre{" "}
              <strong>intérêt légitime</strong> (sécurité, amélioration du
              service). Lorsque la loi l&apos;exige, nous recueillons votre
              consentement.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900">
              4. Durée de conservation
            </h2>
            <p className="mt-2 leading-relaxed">
              Vos données sont conservées tant que votre compte est actif. Après
              clôture du compte, nous pouvons conserver certaines données pendant
              une durée limitée pour respecter nos obligations légales ou
              réglementaires, puis les supprimer ou les anonymiser. Vous pouvez
              demander la suppression de votre compte et de vos données à tout
              moment (voir « Vos droits »).
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900">
              5. Destinataires et sous-traitants
            </h2>
            <p className="mt-2 leading-relaxed">
              Les données sont hébergées et traitées via des prestataires
              assurant la fourniture du service (hébergement, base de données,
              authentification). Actuellement, nous utilisons notamment{" "}
              <strong>Supabase</strong> (hébergement base de données et
              authentification) et <strong>Vercel</strong> (hébergement du site).
              Ces acteurs sont choisis pour leurs engagements en matière de
              sécurité et de conformité (mesures techniques et organisationnelles
              appropriées). Ils n&apos;utilisent vos données que pour les finalités
              décrites et conformément à nos instructions.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900">
              6. Vos droits (RGPD)
            </h2>
            <p className="mt-2 leading-relaxed">
              Conformément au Règlement général sur la protection des données
              (RGPD) et à la loi « informatique et libertés », vous disposez des
              droits suivants :
            </p>
            <ul className="mt-3 list-inside list-disc space-y-1 pl-2">
              <li>
                <strong>Droit d&apos;accès</strong> : obtenir une copie de vos
                données personnelles.
              </li>
              <li>
                <strong>Droit de rectification</strong> : faire corriger des
                données inexactes ou incomplètes.
              </li>
              <li>
                <strong>Droit à l&apos;effacement</strong> : demander la
                suppression de vos données dans les cas prévus par la loi.
              </li>
              <li>
                <strong>Droit à la portabilité</strong> : recevoir vos données dans
                un format structuré et couramment utilisé.
              </li>
              <li>
                <strong>Droit d&apos;opposition</strong> : vous opposer à certains
                traitements (ex. prospection).
              </li>
              <li>
                <strong>Droit de limiter le traitement</strong> : demander une
                limitation dans les situations prévues par le RGPD.
              </li>
            </ul>
            <p className="mt-3 leading-relaxed">
              Pour exercer ces droits, contactez-nous via la page{" "}
              <Link href="/contact" className="text-emerald-600 hover:underline">
                Contact
              </Link>
              . Vous avez également le droit d&apos;introduire une réclamation
              auprès de la{" "}
              <a
                href="https://www.cnil.fr"
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-600 hover:underline"
              >
                CNIL
              </a>{" "}
              (Commission nationale de l&apos;informatique et des libertés).
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900">
              7. Cookies et stockage local
            </h2>
            <p className="mt-2 leading-relaxed">
              FacturePro utilise des cookies ou des mécanismes équivalents
              (stockage local) pour gérer votre session de connexion et
              assurer le bon fonctionnement de l&apos;application. Ces données
              sont nécessaires au service et ne sont pas utilisées pour du
              ciblage publicitaire. Vous pouvez configurer votre navigateur pour
              refuser les cookies ; l&apos;accès à certaines fonctionnalités
              (connexion, tableau de bord) pourrait alors être limité.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900">
              8. Sécurité
            </h2>
            <p className="mt-2 leading-relaxed">
              Nous mettons en œuvre des mesures techniques et organisationnelles
              adaptées pour protéger vos données (accès sécurisé, chiffrement,
              hébergement chez des acteurs reconnus). Les mots de passe sont
              stockés de manière irréversible (hachage). Il vous appartient de
              conserver vos identifiants de connexion de façon confidentielle.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900">
              9. Modifications
            </h2>
            <p className="mt-2 leading-relaxed">
              Cette politique de confidentialité peut être modifiée pour refléter
              des changements de pratique ou de réglementation. La date de
              dernière mise à jour est indiquée en tête de page. Nous vous
              invitons à la consulter régulièrement. Une utilisation continue du
              service après publication des modifications vaut acceptation de la
              nouvelle version.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-900">
              10. Contact
            </h2>
            <p className="mt-2 leading-relaxed">
              Pour toute question relative à vos données personnelles ou à cette
              politique, vous pouvez nous contacter via la page{" "}
              <Link href="/contact" className="text-emerald-600 hover:underline">
                Contact
              </Link>
              .
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
