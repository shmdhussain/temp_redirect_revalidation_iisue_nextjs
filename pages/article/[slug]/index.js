import { promises as fs } from "fs";
import path from "path";
import chalk from "chalk";
import styles from "/styles/article.module.scss";

export default function ArticlePage({ headline, summary }) {
	return (
		<article className={`${styles.article}`}>
			<h1 className={`${styles.h1}`}>{headline}</h1>
			<p className={`${styles.p}`}>{summary}</p>
		</article>
	);
}

export async function getStaticProps({ params }) {
	const { slug } = params;
	const [id, ...suffix] = slug.split("-");

	console.log(
		chalk.green(`START: running the get static props for the article`)
	);

	/*START: get article data from the file system(for demo) usually get from api*/
	const articleDataPath = path.join(
		process.cwd(),
		`dummy_data/article/${id}.json`
	);
	let articleData = await fs.readFile(articleDataPath, "utf8");
	articleData = JSON.parse(articleData);
	/*END: get article data from the file system(for demo) usually get from api*/
	console.log(chalk.blue(`suffix from the url: ${suffix}`));
	console.log(
		chalk.blue(`headline from the data api: ${articleData.headline}`)
	);
	console.log(chalk.blue(`article id from the url: ${id}`));
	if (articleData.headline != suffix.join("-")) {
		console.log(
			chalk.red(
				`suffix from url and article headline is diff so take user to correct url with correct suffic`
			)
		);
		return {
			redirect: {
				destination: `/article/${id}-${encodeURIComponent(
					articleData.headline
				)}`,
				revalidate: 10,
				permanent: false,
			},
		};
	}
	console.log(chalk.green(`END: running the get static props for the article`));
	return {
		props: {
			id: parseInt(id),
			headline: articleData.headline,
			summary: articleData.summary,
		},
		revalidate: 10,
	};
}

export async function getStaticPaths() {
	return { paths: [{ params: { slug: "123-abc" } }], fallback: "blocking" };
}
