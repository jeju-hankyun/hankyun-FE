import React, { useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import LoginPage from './auth/LoginPage';
import GoogleAuthCallback from './auth/GoogleAuthCallback';
import WorkationDashboard from './WorkationDashboard';
import UserProfilePage from './pages/user-profile';
import WorkerRegistrationPage from './pages/worker-registration';
import ClubMemberRegistrationPage from './pages/club-member-registration';
import OrganizationListPage from './pages/organizations/OrganizationList';
import AddOrganizationPage from './pages/organizations/AddOrganization';
import CreateWorkcationGroupPage from './pages/workcation-groups/CreateWorkcationGroup';
import WorkcationGroupListPage from './pages/workcation-groups/WorkcationGroupList';
import CreateTripPage from './pages/trips/CreateTrip';
import TripListPage from './pages/trips/TripList';
import TripDescriptionPrListPage from './pages/trip-description-prs/TripDescriptionPrList';
import CvcManagementPage from './pages/cvc/CvcManagement'; // 새 페이지 임포트
import CvcStatusPage from './pages/cvc/CvcStatus'; // 새 페이지 임포트
import UploadReportPage from './pages/cvc/UploadReport'; // 새 페이지 임포트
import { setNavigateFunction } from './auth/api';

const AuthRouter: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    setNavigateFunction(navigate);
  }, [navigate]);

  return (
    <Routes>
      <Route path="/" element={<WorkationDashboard />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/auth/google/callback" element={<GoogleAuthCallback />} />
      <Route path="/overview" element={<WorkationDashboard />} />
      {/* 사용자 관련 페이지 라우트 */}
      <Route path="/profile" element={<UserProfilePage />} />
      <Route path="/register-worker" element={<WorkerRegistrationPage />} />
      <Route path="/register-club-member" element={<ClubMemberRegistrationPage />} />
      {/* 조직 관련 페이지 라우트 */}
      <Route path="/organizations" element={<OrganizationListPage />} />
      <Route path="/organizations/add" element={<AddOrganizationPage />} />
      {/* 워케이션 그룹 관련 페이지 라우트 */}
      <Route path="/organizations/:organizationId/workcation-groups/create" element={<CreateWorkcationGroupPage />} />
      <Route path="/organizations/:organizationId/workcation-groups" element={<WorkcationGroupListPage />} />
      {/* Trip 관련 페이지 라우트 */}
      <Route path="/workcation-groups/:workcationGroupId/trips/create" element={<CreateTripPage />} />
      <Route path="/workcation-groups/:workcationGroupId/trips" element={<TripListPage />} />
      {/* Trip Description PR 관련 페이지 라우트 */}
      <Route path="/trip-descriptions/prs" element={<TripDescriptionPrListPage />} />
      {/* CVC 관련 페이지 라우트 */}
      <Route path="/cvc/manage" element={<CvcManagementPage />} />
      <Route path="/cvc/status" element={<CvcStatusPage />} />
      <Route path="/cvc/upload-report" element={<UploadReportPage />} />
      {/* 다른 페이지 라우트도 여기에 추가할 수 있습니다. */}
    </Routes>
  );
};

export default AuthRouter;
