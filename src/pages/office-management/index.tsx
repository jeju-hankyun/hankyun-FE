import type { Office, GlobalState } from "../../shared/types";
import { useState, useEffect } from "react";
import {
  OfficeContainer,
  SectionHeader,
  SectionTitle,
  StatusBadge,
  RefreshButton,
  OfficeGrid,
  OfficeItem,
  OfficeHeader,
  OfficeName,
  OfficeStatusBadge,
  OfficeDescription,
  OfficeMetrics,
  MetricItem,
  CheckedInInfo,
  OfficePageContainer,
  PageTitle,
  PageSubtitle,
  DetailedSection,
  DetailedSectionTitle,
  MapContainer,
  LocationCard,
  LocationHeader,
  LocationName,
  LocationAddress,
  LocationFeatures,
  FeatureTag,
  PriceInfo,
  BookingButton,
  ReviewsSection,
  ReviewItem,
  ReviewHeader,
  ReviewerName,
  ReviewDate,
  ReviewRating,
  ReviewText,
  CalendarSection,
  CalendarHeader,
  CalendarGrid,
  CalendarDay,
  LegendItem,
  Legend,
} from "./style";

interface OfficeItemComponentProps {
  office: Office;
}

const OfficeItemComponent: React.FC<OfficeItemComponentProps> = ({ office }) => (
  <OfficeItem>
    <OfficeHeader>
      <OfficeName>{office.name || '정보 없음'}</OfficeName>
      <OfficeStatusBadge status={office.status || 'available'}> {/* 기본값 제공 */}
        {office.status === "occupied" ? "사용중" : "예약가능"}
      </OfficeStatusBadge>
    </OfficeHeader>
    <OfficeDescription>{office.description || '설명 없음'}</OfficeDescription>
    <OfficeMetrics>
      <MetricItem>수용인원: {office.capacity || '정보 없음'}</MetricItem>
      <MetricItem>WiFi: {office.wifi || '정보 없음'}</MetricItem>
      <MetricItem>이용료: {office.price || '정보 없음'}</MetricItem>
    </OfficeMetrics>
    {office.status === "occupied" && (office.checkedIn !== undefined && office.checkedIn !== null) && (
      <CheckedInInfo>
        체크인: {office.checkedIn}명
      </CheckedInInfo>
    )}
  </OfficeItem>
);

interface OfficeManagementPageProps {
  globalState?: GlobalState;
  isDetailView?: boolean;
}

const OfficeManagementPage: React.FC<OfficeManagementPageProps> = ({
  globalState,
  isDetailView = false
}) => {
  const [offices, setOffices] = useState<Office[]>([]);
  const [detailedLocations, setDetailedLocations] = useState<any[]>([]); // 상세 오피스 정보 (API 연동 필요)
  const [reviews, setReviews] = useState<any[]>([]); // 리뷰 정보 (API 연동 필요)
  const [calendarDays, setCalendarDays] = useState<any[]>([]); // 캘린더 정보 (API 연동 필요)
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // TODO: 실제 API 호출을 통해 데이터를 가져오는 useEffect 추가 필요
  useEffect(() => {
    const fetchOfficeData = async () => {
      try {
        setLoading(true);
        setError(null);
        // TODO: 실제 API 호출 (예: getOffices, getDetailedLocations, getReviews, getCalendarData 등)

        // 임시 로딩 완료 처리
        setTimeout(() => {
          // API 응답 데이터로 상태 업데이트
          setOffices([]); // 실제 데이터로 교체
          setDetailedLocations([]); // 실제 데이터로 교체
          setReviews([]); // 실제 데이터로 교체
          setCalendarDays([]); // 실제 데이터로 교체
          setLoading(false);
        }, 1000);

      } catch (err) {
        console.error("오피스 관리 페이지 데이터 로딩 실패:", err);
        setError("데이터를 불러오는 데 실패했습니다.");
        setLoading(false);
      }
    };
    fetchOfficeData();
  }, []);

  const handleRefresh = (e: React.MouseEvent<HTMLButtonElement>) => {
    const target = e.target as HTMLElement;
    target.style.transform = "rotate(360deg)";
    target.style.transition = "transform 0.5s ease";
    setTimeout(() => {
      target.style.transform = "";
    }, 500);
    // TODO: 새로고침 시 API 데이터 다시 불러오기
  };

  // 상세 페이지인 경우
  if (isDetailView || (globalState && globalState.activeTab === "office")) {
    return (
      <OfficePageContainer>
        <div>
          <PageTitle>🏢 제주도 오피스 관리</PageTitle>
          <PageSubtitle>
            제주도 전역의 워케이션 스페이스를 찾아보고 예약하세요
          </PageSubtitle>
        </div>

        {error && <p style={{ color: 'red' }}>{error}</p>}
        {loading && <p>오피스 데이터 로딩 중...</p>}

        {/* 오피스 통계는 더미 데이터이므로 삭제합니다. */}
        {/* <DetailedSection>
          <DetailedSectionTitle>📈 오피스 현황</DetailedSectionTitle>
          <StatsGrid>
            <StatCard>
              <StatValue>12</StatValue>
              <StatLabel>전체 오피스</StatLabel>
            </StatCard>
            <StatCard>
              <StatValue>8</StatValue>
              <StatLabel>이용 가능</StatLabel>
            </StatCard>
            <StatCard>
              <StatValue>4</StatValue>
              <StatLabel>사용 중</StatLabel>
            </StatCard>
            <StatCard>
              <StatValue>₩165K</StatValue>
              <StatLabel>평균 가격</StatLabel>
            </StatCard>
            <StatCard>
              <StatValue>85%</StatValue>
              <StatLabel>이용률</StatLabel>
            </StatCard>
            <StatCard>
              <StatValue>4.8</StatValue>
              <StatLabel>평균 평점</StatLabel>
            </StatCard>
          </StatsGrid>
        </DetailedSection> */}

        {/* 오피스 위치 (API 연동 필요) */}
        {!loading && !error && detailedLocations.length > 0 ? (
          <DetailedSection>
            <DetailedSectionTitle>📍 오피스 위치</DetailedSectionTitle>
            <MapContainer>
              <div style={{ 
                background: 'linear-gradient(135deg, #4a90e2, #7b68ee)',
                height: '300px',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '18px',
                marginBottom: '24px'
              }}>
                🗺️ 제주도 워케이션 스페이스 지도
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '20px' }}>
                {detailedLocations.map((location) => (
                  <LocationCard key={location.id}>
                    <LocationHeader>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ fontSize: '24px' }}>{location.image || '🏢'}</div>
                        <div>
                          <LocationName>{location.name || '이름 없음'}</LocationName>
                          <LocationAddress>{location.address || '주소 없음'}</LocationAddress>
                        </div>
                      </div>
                      <ReviewRating>{location.rating ? `${location.rating}⭐` : '정보 없음'}</ReviewRating>
                    </LocationHeader>
                    
                    <LocationFeatures>
                      {(location.features && location.features.length > 0) ? location.features.map((feature: string, idx: number) => (
                        <FeatureTag key={idx}>{feature}</FeatureTag>
                      )) : '특징 없음'}
                    </LocationFeatures>
                    
                    <div style={{ 
                      fontSize: '13px', 
                      color: 'rgba(255,255,255,0.7)',
                      marginBottom: '16px',
                      lineHeight: '1.4'
                    }}>
                      {location.description || '설명 없음'}
                    </div>
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <PriceInfo>{location.price || '가격 정보 없음'}</PriceInfo>
                      <BookingButton status={location.status || 'available'}> {/* 기본값 제공 */}
                        {location.status === 'occupied' ? '사용중' : '예약하기'}
                      </BookingButton>
                    </div>
                  </LocationCard>
                ))}
              </div>
            </MapContainer>
          </DetailedSection>
        ) : (!loading && !error && <p style={{ textAlign: 'center' }}>상세 오피스 정보가 없습니다.</p>)}

        {/* 예약 캘린더 (API 연동 필요) */}
        {!loading && !error && calendarDays.length > 0 ? (
          <DetailedSection>
            <DetailedSectionTitle>📅 예약 캘린더</DetailedSectionTitle>
            <CalendarSection>
              <CalendarHeader>
                <h4 style={{ margin: 0, color: '#fff' }}>2024년 1월</h4> {/* TODO: 동적으로 변경 */}
                <Legend>
                  <LegendItem color="#4caf50">예약가능</LegendItem>
                  <LegendItem color="#f44336">사용중</LegendItem>
                  <LegendItem color="#ff9800">예약됨</LegendItem>
                  <LegendItem color="#9e9e9e">주말</LegendItem>
                </Legend>
              </CalendarHeader>
              
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(7, 1fr)', 
                gap: '2px',
                marginBottom: '12px',
                fontSize: '12px',
                fontWeight: '600',
                color: 'rgba(255,255,255,0.7)'
              }}>
                <div style={{ textAlign: 'center', padding: '8px' }}>일</div>
                <div style={{ textAlign: 'center', padding: '8px' }}>월</div>
                <div style={{ textAlign: 'center', padding: '8px' }}>화</div>
                <div style={{ textAlign: 'center', padding: '8px' }}>수</div>
                <div style={{ textAlign: 'center', padding: '8px' }}>목</div>
                <div style={{ textAlign: 'center', padding: '8px' }}>금</div>
                <div style={{ textAlign: 'center', padding: '8px' }}>토</div>
              </div>
              
              <CalendarGrid>
                {calendarDays.map((day, index) => (
                  <CalendarDay 
                    key={index} 
                    status={day.status || 'available'} // 기본값 제공
                    isToday={day.isToday}
                  >
                    {day.date || '-'}
                  </CalendarDay>
                ))}
              </CalendarGrid>
            </CalendarSection>
          </DetailedSection>
        ) : (!loading && !error && <p style={{ textAlign: 'center' }}>예약 캘린더 정보가 없습니다.</p>)}

        {/* 리뷰 섹션 (API 연동 필요) */}
        {!loading && !error && reviews.length > 0 ? (
          <DetailedSection>
            <DetailedSectionTitle>💬 이용 후기</DetailedSectionTitle>
            <ReviewsSection>
              {reviews.map((review) => (
                <ReviewItem key={review.id}>
                  <ReviewHeader>
                    <div>
                      <ReviewerName>{review.reviewer || '익명'}</ReviewerName>
                      <ReviewDate>{review.date || '날짜 정보 없음'}</ReviewDate>
                    </div>
                    <ReviewRating>{review.rating ? "⭐".repeat(review.rating) : '정보 없음'}</ReviewRating>
                  </ReviewHeader>
                  <div style={{ 
                    fontSize: '12px', 
                    color: '#4a90e2',
                    marginBottom: '8px',
                    fontWeight: '500'
                  }}>
                    {review.location || '장소 정보 없음'}
                  </div>
                  <ReviewText>{review.text || '내용 없음'}</ReviewText>
                </ReviewItem>
              ))}
            </ReviewsSection>
          </DetailedSection>
        ) : (!loading && !error && <p style={{ textAlign: 'center' }}>이용 후기가 없습니다.</p>)}

        {/* 간단한 오피스 목록 (API 연동 필요) */}
        {!loading && !error && offices.length > 0 ? (
          <DetailedSection>
            <DetailedSectionTitle>🏢 빠른 예약</DetailedSectionTitle>
            <OfficeGrid>
              {offices.map((office) => (
                <OfficeItemComponent key={office.id} office={office} />
              ))}
            </OfficeGrid>
          </DetailedSection>
        ) : (!loading && !error && <p style={{ textAlign: 'center' }}>예약 가능한 오피스 정보가 없습니다.</p>)}
      </OfficePageContainer>
    );
  }

  // 위젯 뷰 (Overview 페이지용)
  const availableCount = offices.filter(office => office.status === 'available').length;
  const occupiedCount = offices.filter(office => office.status === 'occupied').length;

  return (
    <OfficeContainer>
      <SectionHeader>
        <SectionTitle>
          제주도 오피스 현황
          {!loading && !error && offices.length > 0 ? (
            <>
              <StatusBadge type="available">{availableCount} Available</StatusBadge>
              <StatusBadge type="occupied">{occupiedCount} Occupied</StatusBadge>
            </>
          ) : (
            <StatusBadge type="unavailable">정보 없음</StatusBadge>
          )}
        </SectionTitle>
        <RefreshButton onClick={handleRefresh}>🔄</RefreshButton>
      </SectionHeader>

      {error && <p style={{ color: 'red' }}>{error}</p>}
      {loading && <p>오피스 로딩 중...</p>}

      {!loading && !error && offices.length > 0 ? (
        <OfficeGrid>
          {offices.map((office) => (
            <OfficeItemComponent key={office.id} office={office} />
          ))}
        </OfficeGrid>
      ) : (!loading && !error && <p>오피스 정보가 없습니다.</p>)}
    </OfficeContainer>
  );
};

export default OfficeManagementPage;