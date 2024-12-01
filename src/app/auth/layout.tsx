type Props = {
  children: React.ReactNode;
};

const AuthCallbackLayout = ({ children }: Props) => {
  return (
    <div className="container h-screen flex justify-center items-center">
      {children}
    </div>
  );
};

export default AuthCallbackLayout;
