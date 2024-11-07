import { Link } from 'react-router-dom'
import s from './Home2.module.scss'

export default function Home2() {
	return (
		<div className={s.home2}>
			<h1>
				<span>Home2</span>
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
