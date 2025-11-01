import Header from '../Header';

export default function HeaderExample() {
  return (
    <Header
      user={{ username: 'johndoe', isAdmin: true }}
      onLogout={() => console.log('Logout clicked')}
      onNavigate={(path) => console.log('Navigate to:', path)}
    />
  );
}