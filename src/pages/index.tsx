import { GetStaticProps } from 'next';

import Head from 'next/head';

import { SubscribeButton } from '../components/SubscribeButton';
import { stripe } from '../services/stripe';

import styles from './home.module.scss';

interface HomeProps {
	product: {
		priceId: string;
		amount: number;
	}
}

// Cliente-side - Quando uma informação não é necessária quando o site estiver carregando. Pode aparecer depois que o site for exibido em tela
// Server-side - Quando for necessário indexação, porém é necessário mostrar dados dinâmicos referente ao usuário logado. 
// Static Site Generation - Quando é necessário indexação e as páginas podem ser compartilhadas com todos os usuários.

// Post de um blog
// Conteúdo - SSG
// Comentários - Cliente Side

export default function Home({ product }: HomeProps) {
	return (
		<>
		<Head>
			<title>Home | ig.news</title>
		</Head>

		<main className={styles.contentContainer}>
			<section className={styles.hero}>
				<span>👏 Hey, welcome</span>
				<h1>News about the <span>React</span> world.</h1>
				<p>
					Get access to all the publications <br />
					<span>for {product.amount} month</span>
				</p>
				<SubscribeButton priceId={product.priceId}/>
			</section>

			<img src="/images/avatar.svg" alt="Girl coding" />
		</main>
		</>
	);
}

export const getStaticProps: GetStaticProps = async () => {
	const price = await stripe.prices.retrieve('price_1JvtxWK88232d4O4fzy6QOy2');

	const product = {
		price: price.id,
		amount: new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: 'USD',
		}).format(price.unit_amount / 100),
	}

	return {
		props: {
			product,
		},
		revalidate: 60 * 60 * 24, // 24 hours
	}
}
