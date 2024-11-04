import * as React from 'react'
import {useAuth} from './context/auth-context'

import {FullPageSpinner} from 'components/lib'

const AuthenticatedApp = React.lazy(() => import('./authenticated-app'))
const UnauthenticatedApp = React.lazy(() =>
  import('./unauthenticated-app.exercise'),
)
//Lazy Loading
// AuthenticatedApp: Usa React.lazy para carregar o componente AuthenticatedApp de forma assíncrona.
// UnauthenticatedApp: Usa React.lazy para carregar o componente UnauthenticatedApp de forma assíncrona.
// Componente App
// useAuth: Usa o hook useAuth para obter o usuário autenticado.
// React.Suspense: Envolve o conteúdo do componente App com React.Suspense para lidar com a renderização assíncrona dos componentes AuthenticatedApp e UnauthenticatedApp. Enquanto os componentes estão sendo carregados, o FullPageSpinner é exibido.
// Renderização Condicional: Renderiza AuthenticatedApp se o usuário estiver autenticado (user), caso contrário, renderiza UnauthenticatedApp.
// Exportação
// App: Exporta o componente App.
// Resumo
// O código define um componente App que usa lazy loading para carregar os componentes AuthenticatedApp e UnauthenticatedApp de forma assíncrona. Dependendo do estado de autenticação do usuário, ele renderiza um dos dois componentes. Enquanto os componentes estão sendo carregados, um spinner (FullPageSpinner) é exibido.
function App() {
  const {user} = useAuth()
  return (
    <React.Suspense fallback={<FullPageSpinner />}>
      {user ? <AuthenticatedApp /> : <UnauthenticatedApp />}
    </React.Suspense>
  )
}

export {App}
