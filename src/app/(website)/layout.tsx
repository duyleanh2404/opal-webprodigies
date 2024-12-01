import LandingPageNavbar from './_components/navbar';

type Props = {
  children: React.ReactNode;
};

const HomeLayout = ({ children }: Props) => {
  return (
    <div className="flex flex-col py-10 px-10 xl:px-0 container">
      <LandingPageNavbar />
      {children}
    </div>
  );
};

export default HomeLayout;
