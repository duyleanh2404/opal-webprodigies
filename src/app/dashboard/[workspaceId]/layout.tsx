import { onAuthenticateUser } from '@/actions/user';
import {
  getUserNotifications,
  getUserVideos,
  getUserWorkspaces,
  getWorkspaceFolders,
  verifyAccessToWorkspace,
} from '@/actions/workspace';
import { redirect } from 'next/navigation';
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';
import Sidebar from '@/components/global/sidebar';

type Props = {
  params: { workspaceId: string };
  children: React.ReactNode;
};

const WorkspaceLayout = async ({
  params: { workspaceId },
  children,
}: Props) => {
  const auth = await onAuthenticateUser();

  if (!auth.user?.workspace || !auth.user.workspace.length) {
    redirect('/auth/sign-in');
  }

  const hasAccess = await verifyAccessToWorkspace(workspaceId);

  if (hasAccess.status !== 200) {
    redirect(`/dashboard/${auth.user?.workspace[0].id}`);
  }

  if (!hasAccess.data?.workspace) {
    return null;
  }

  const query = new QueryClient();

  await query.prefetchQuery({
    queryKey: ['workspace-folders'],
    queryFn: () => getWorkspaceFolders(workspaceId),
  });

  await query.prefetchQuery({
    queryKey: ['user-videos'],
    queryFn: () => getUserVideos(workspaceId),
  });

  await query.prefetchQuery({
    queryKey: ['user-workspaces'],
    queryFn: () => getUserWorkspaces(),
  });

  await query.prefetchQuery({
    queryKey: ['user-notifications'],
    queryFn: () => getUserNotifications(),
  });

  return (
    <HydrationBoundary state={dehydrate(query)}>
      <div className="flex h-screen w-screen">
        <Sidebar activeWorkspaceId={workspaceId} />
      </div>
    </HydrationBoundary>
  );
};

export default WorkspaceLayout;
