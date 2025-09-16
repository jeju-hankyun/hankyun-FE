import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useParams } from 'react-router-dom';
import { getTrips } from '../../../auth/api';
import type { TripResponse, BaseResponse, CursorResponse } from '../../../auth/api';

const PageContainer = styled.div`
  padding: 20px;
  background-color: #f0f2f5;
  min-height: 100vh;
  color: #333;
`;

const SectionTitle = styled.h2`
  color: #007bff;
  margin-bottom: 20px;
`;

const TripListContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
`;

const TripCard = styled.div`
  background-color: #ffffff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
`;

const TripPlace = styled.h3`
  margin: 0 0 10px 0;
  color: #333;
`;

const TripDetail = styled.p`
  font-size: 14px;
  color: #666;
  margin: 5px 0;
  strong {
    color: #555;
  }
`;

const LoadingText = styled.p`
  text-align: center;
  font-size: 18px;
  color: #555;
`;

const ErrorText = styled.p`
  text-align: center;
  font-size: 18px;
  color: red;
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
      if (response.data && response.data.values) {
        setTrips(response.data.values);
      } else {
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
      <SectionTitle>Trip 목록 (워케이션 그룹 ID: {workcationGroupId})</SectionTitle>
      {error && <ErrorText>{error}</ErrorText>}
      {trips.length === 0 && !loading && !error ? (
        <p style={{ textAlign: 'center' }}>등록된 Trip이 없습니다.</p>
      ) : (
        <TripListContainer>
          {trips.map((trip) => (
            <TripCard key={trip.trip_id}>
              <TripPlace>{trip.place}</TripPlace>
              <TripDetail><strong>ID:</strong> {trip.trip_id}</TripDetail>
              <TripDetail><strong>그룹 ID:</strong> {trip.workcation_group_id}</TripDetail>
              <TripDetail><strong>시작일:</strong> {trip.start_date.split('T')[0]}</TripDetail>
              <TripDetail><strong>종료일:</strong> {trip.end_date.split('T')[0]}</TripDetail>
            </TripCard>
          ))}
        </TripListContainer>
      )}
      {loading && <LoadingText>Trip 목록 로딩 중...</LoadingText>}
    </PageContainer>
  );
};

export default TripListPage;
