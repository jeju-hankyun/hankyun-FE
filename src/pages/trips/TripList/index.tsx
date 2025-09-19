import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useParams } from 'react-router-dom';
import { getTrips } from '../../../auth/api';
import type { TripResponse, BaseResponse, CursorResponse } from '../../../auth/api/interfaces';

const PageContainer = styled.div`
  padding: 32px;
  background: #f8fafc;
  min-height: 100vh;
  color: #1e293b;
`;

const PageHeader = styled.div`
  margin-bottom: 32px;
`;

const PageTitle = styled.h1`
  font-size: 28px;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 8px 0;
`;

const PageSubtitle = styled.p`
  font-size: 16px;
  color: #64748b;
  margin: 0;
`;

const TripListContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 24px;
`;

const TripCard = styled.div`
  background: white;
  padding: 32px;
  border-radius: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid #f1f5f9;
  display: flex;
  flex-direction: column;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #8b5cf6 0%, #7c3aed 100%);
  }
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
  }
`;

const TripPlace = styled.h3`
  margin: 0 0 12px 0;
  color: #1e293b;
  font-size: 18px;
  font-weight: 600;
`;

const TripDetail = styled.p`
  font-size: 14px;
  color: #64748b;
  margin: 6px 0;
  line-height: 1.5;
  
  strong {
    color: #374151;
    font-weight: 600;
  }
`;

const LoadingText = styled.p`
  text-align: center;
  font-size: 16px;
  color: #64748b;
  font-weight: 500;
`;

const ErrorText = styled.p`
  text-align: center;
  font-size: 16px;
  color: #dc2626;
  font-weight: 500;
`;

const TripListPage: React.FC = () => {
  const { workcationGroupId } = useParams<{ workcationGroupId: string }>();
  const [trips, setTrips] = useState<TripResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTrips = async () => {
    if (!workcationGroupId) {
      setError('워케이션 그룹 ID가 필요합니다.');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response: BaseResponse<CursorResponse<TripResponse>> = await getTrips(parseInt(workcationGroupId, 10));
      console.log('Trip 목록 조회 응답:', response);
      console.log('response.data:', response.data);
      console.log('response.data.values:', response.data?.values);
      
      // API 응답 구조를 유연하게 처리
      let tripsData = null;
      
      // response.data가 CursorResponse 구조인 경우
      if (response.data && response.data.values) {
        tripsData = response.data.values;
        console.log('Received trips (from response.data):', tripsData);
      }
      // response 자체가 CursorResponse 구조인 경우 (직접 응답)
      else if ((response as any).values) {
        tripsData = (response as any).values;
        console.log('Received trips (from direct response):', tripsData);
      }
      // response.data가 직접 배열인 경우
      else if (Array.isArray(response.data)) {
        tripsData = response.data;
        console.log('Received trips (from array data):', tripsData);
      }
      
      if (tripsData && tripsData.length > 0) {
        setTrips(tripsData);
      } else {
        console.log('No valid trips data found:', response);
        setError(response.message || 'Trip 목록을 불러오지 못했습니다.');
      }
    } catch (err) {
      console.error('Error fetching trips:', err);
      setError('Trip 목록을 불러오는 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (workcationGroupId) {
      fetchTrips();
    }
  }, [workcationGroupId]);

  if (!workcationGroupId) {
    return <PageContainer><ErrorText>워케이션 그룹 ID가 URL에 제공되지 않았습니다.</ErrorText></PageContainer>;
  }

  return (
    <PageContainer>
      <PageHeader>
        <PageTitle>Trip 목록</PageTitle>
        <PageSubtitle>워케이션 그룹 ID: {workcationGroupId}</PageSubtitle>
      </PageHeader>
      {error && <ErrorText>{error}</ErrorText>}
      {trips.length === 0 && !loading && !error ? (
        <p style={{ textAlign: 'center' }}>등록된 Trip이 없습니다.</p>
      ) : (
        <TripListContainer>
          {trips.map((trip) => (
            <TripCard key={trip.trip_id}>
              <TripPlace>{trip.place ? trip.place : '없음'}</TripPlace>
              <TripDetail><strong>ID:</strong> {trip.trip_id ? trip.trip_id : '없음'}</TripDetail>
              <TripDetail><strong>그룹 ID:</strong> {trip.workcation_group_id ? trip.workcation_group_id : '없음'}</TripDetail>
              <TripDetail><strong>시작일:</strong> {trip.start_date ? trip.start_date.split('T')[0] : '없음'}</TripDetail>
              <TripDetail><strong>종료일:</strong> {trip.end_date ? trip.end_date.split('T')[0] : '없음'}</TripDetail>
            </TripCard>
          ))}
        </TripListContainer>
      )}
      {loading && <LoadingText>Trip 목록 로딩 중...</LoadingText>}
    </PageContainer>
  );
};

export default TripListPage;
