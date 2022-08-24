import { promises as fs } from "fs";
import path from "path";
import chalk from "chalk";

import Link from "next/link";

import styles from "/styles/main.module.scss";
export default function IndexPage({ articleList }) {
	return (
		<main className={`${styles.main}`}>
			<nav>
				<ul>
					{articleList.map((articleItem) => {
						return (
							<li key={articleItem.id}>
								<Link
									href={`/article/${articleItem.id}-${articleItem.headline}`}
								>
									<a>Article {articleItem.headline}</a>
								</Link>
							</li>
						);
					})}
				</ul>
			</nav>
		</main>
	);
}
export async function getStaticProps({ params }) {
	console.log(chalk.yellow(`START: running the get static props for the home`));
	/*START: get article data from the file system(for demo) usually get from api*/
	const articleListDataPath = path.join(
		process.cwd(),
		`dummy_data/article/list.json`
	);
	let articleList = await fs.readFile(articleListDataPath, "utf8");
	articleList = JSON.parse(articleList);
	/*END: get article data from the file system(for demo) usually get from api*/

	console.log(chalk.yellow(`END: running the get static props for the home`));
	return {
		props: {
			articleList,
		},
		revalidate: 10,
	};
}
