import { Link } from 'react-router-dom'
import s from './Home3.module.scss'

export default function Home3() {
	return (
		<div className={s.home3}>
			<h1>
				<span>Home3</span>
				<span>
					<p><Link to="/login">login</Link></p>
					<p><Link to="/signup">signup</Link></p>
					<p><Link to="/main">Main</Link></p>
					<p><Link to="/main/home">Home</Link></p>
					<p><Link to="/main/home2">Home2</Link></p>
					<p><Link to="/main/home3">Home3</Link></p>
				</span>
			</h1>
		</div>
	)
}
