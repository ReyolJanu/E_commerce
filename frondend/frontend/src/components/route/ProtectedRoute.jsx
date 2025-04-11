import {useSelector} from 'react-redux'
import {Navigate} from 'react-router-dom'

function ProtectedRoute({children}) {
  const{ isAuthenticated } = useSelector(state => state.authState)

  if(!isAuthenticated){
    return <Navigate to='/login' />
  }else{
    return children;
  }
}

export default ProtectedRoute
