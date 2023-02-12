import { FC } from "react";
import { Route, Routes } from "react-router-dom";
import * as ROUTES from "../constants/routes";

import AllTasksPage from "../pages/allTasks";
import GroupPage from "../pages/group";
import GroupsPage from "../pages/groups";
import HomePage from "../pages/home";
import NotFoundPage from "../pages/notFound";
import ProfilePage from "../pages/profile";
import ChatPage from "../pages/chat";
import SchedulePage from "../pages/schedule";
import SignInPage from "../pages/signin";
import SignUpPage from "../pages/signup";
import SimpleSchedulePage from "../pages/simpleSchedule";
import StarterPage from "../pages/starter";
import TaskPage from "../pages/task";
import TasksPage from "../pages/tasks";

const AppRoutes: FC = () => {
  return (
    <>
      <Routes>
        <Route path={ROUTES.STARTER} element={<StarterPage />} />

        <Route path={ROUTES.HOME} element={<HomePage />} />

        <Route path={ROUTES.GROUPS} element={<GroupsPage />} />
        <Route path={`${ROUTES.GROUPS}/:id`} element={<GroupPage />} />
        <Route
          path={`${ROUTES.GROUPS}/:id/schedule`}
          element={<SchedulePage />}
        />
        <Route path={`${ROUTES.GROUPS}/:id/tasks`} element={<TasksPage />} />
        <Route
          path={`${ROUTES.GROUPS}/:groupID/tasks/:taskID`}
          element={<TaskPage />}
        />
        <Route
          path={`${ROUTES.GROUPS}/:id/demo`}
          element={<SimpleSchedulePage />}
        />

        <Route path={`${ROUTES.HOMEWORKS}`} element={<AllTasksPage />} />

        <Route path={`${ROUTES.CHAT}`} element={<ChatPage />} />

        <Route path={`${ROUTES.PROFILE}/:id`} element={<ProfilePage />} />

        <Route path={ROUTES.SIGN_IN} element={<SignInPage />} />
        <Route path={ROUTES.SIGN_UP} element={<SignUpPage />} />

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
};

export default AppRoutes;
