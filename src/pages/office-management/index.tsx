import type { Office, GlobalState } from "../../shared/types";
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
  StatsGrid,
  StatCard,
  StatValue,
  StatLabel,
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
      <OfficeName>{office.name}</OfficeName>
      <OfficeStatusBadge status={office.status}>
        {office.status === "occupied" ? "사용중" : "예약가능"}
      </OfficeStatusBadge>
    </OfficeHeader>
    <OfficeDescription>{office.description}</OfficeDescription>
    <OfficeMetrics>
      <MetricItem>수용인원: {office.capacity}</MetricItem>
      <MetricItem>WiFi: {office.wifi}</MetricItem>
      <MetricItem>이용료: {office.price}</MetricItem>
    </OfficeMetrics>
    {office.status === "occupied" && (
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
  const offices: Office[] = [
    {
      id: 1,
      name: "제주 스마트워크센터",
      description: "8인실, 회의실 2개 포함",
      status: "occupied",
      capacity: "8명",
      wifi: "100Mbps",
      price: "15만원/일",
      checkedIn: 8,
    },
    {
      id: 2,
      name: "서귀포 코워킹스페이스",
      description: "12인실, 바다 뷰 포함",
      status: "available",
      capacity: "12명",
      wifi: "500Mbps",
      price: "20만원/일",
      checkedIn: 0,
    },
    {
      id: 3,
      name: "한라산 워케이션센터",
      description: "6인실, 자연친화적 환경",
      status: "available",
      capacity: "6명",
      wifi: "200Mbps",
      price: "12만원/일",
      checkedIn: 0,
    },
  ];

  const detailedLocations = [
    {
      id: 1,
      name: "제주 스마트워크센터",
      address: "제주시 연동 123-45",
      image: "🏢",
      features: ["회의실", "카페", "주차장", "WiFi", "프린터"],
      price: "150,000원/일",
      rating: 4.8,
      status: "occupied" as const,
      capacity: 8,
      amenities: ["24시간 이용", "보안카드", "무료 커피", "에어컨"],
      description: "제주시 중심가에 위치한 프리미엄 워케이션 센터입니다."
    },
    {
      id: 2,
      name: "서귀포 오션뷰 센터",
      address: "서귀포시 중문동 567-89",
      image: "🌊",
      features: ["오션뷰", "발코니", "라운지", "WiFi", "화상회의실"],
      price: "200,000원/일",
      rating: 4.9,
      status: "available" as const,
      capacity: 12,
      amenities: ["바다 전망", "요가룸", "휴게공간", "무료 주차"],
      description: "바다가 보이는 최고의 워케이션 환경을 제공합니다."
    },
    {
      id: 3,
      name: "한라산 자연 워크스페이스",
      address: "제주시 한라산로 901-23",
      image: "🏔️",
      features: ["자연뷰", "조용한 환경", "산책로", "WiFi", "독서공간"],
      price: "120,000원/일",
      rating: 4.7,
      status: "available" as const,
      capacity: 6,
      amenities: ["자연 환경", "힐링 공간", "트래킹 코스", "무료 차"],
      description: "한라산 자락의 조용하고 평화로운 워크스페이스입니다."
    },
  ];

  const reviews = [
    {
      id: 1,
      reviewer: "김워케",
      date: "2024-01-15",
      rating: 5,
      text: "정말 좋은 환경에서 일할 수 있었습니다. 바다가 보이는 전망이 최고였어요!",
      location: "서귀포 오션뷰 센터"
    },
    {
      id: 2,
      reviewer: "박개발",
      date: "2024-01-10",
      rating: 4,
      text: "시설이 깔끔하고 WiFi 속도도 빨라서 개발 업무하기 좋았습니다.",
      location: "제주 스마트워크센터"
    },
    {
      id: 3,
      reviewer: "이힐링",
      date: "2024-01-05",
      rating: 5,
      text: "자연 속에서 일하니 창의력이 샘솟더라구요. 재방문 예정입니다!",
      location: "한라산 자연 워크스페이스"
    },
  ];

  const generateCalendarDays = () => {
    const days = [];
    const today = new Date();
    
    for (let i = 0; i < 35; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i - 7); // 일주일 전부터 시작
      
      let status: 'available' | 'occupied' | 'booked' | 'weekend' = 'available';
      
      if (date.getDay() === 0 || date.getDay() === 6) {
        status = 'weekend';
      } else if (Math.random() > 0.7) {
        status = 'occupied';
      } else if (Math.random() > 0.8) {
        status = 'booked';
      }
      
      days.push({
        date: date.getDate(),
        status,
        month: date.getMonth(),
        isToday: date.toDateString() === today.toDateString()
      });
    }
    
    return days;
  };

  const calendarDays = generateCalendarDays();

  const handleRefresh = (e: React.MouseEvent<HTMLButtonElement>) => {
    const target = e.target as HTMLElement;
    target.style.transform = "rotate(360deg)";
    target.style.transition = "transform 0.5s ease";
    setTimeout(() => {
      target.style.transform = "";
    }, 500);
  };

  const availableCount = offices.filter(office => office.status === 'available').length;
  const occupiedCount = offices.filter(office => office.status === 'occupied').length;

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

        {/* 오피스 통계 */}
        <DetailedSection>
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
        </DetailedSection>

        {/* 오피스 위치 */}
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
                      <div style={{ fontSize: '24px' }}>{location.image}</div>
                      <div>
                        <LocationName>{location.name}</LocationName>
                        <LocationAddress>{location.address}</LocationAddress>
                      </div>
                    </div>
                    <ReviewRating>{location.rating}⭐</ReviewRating>
                  </LocationHeader>
                  
                  <LocationFeatures>
                    {location.features.map((feature, idx) => (
                      <FeatureTag key={idx}>{feature}</FeatureTag>
                    ))}
                  </LocationFeatures>
                  
                  <div style={{ 
                    fontSize: '13px', 
                    color: 'rgba(255,255,255,0.7)',
                    marginBottom: '16px',
                    lineHeight: '1.4'
                  }}>
                    {location.description}
                  </div>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <PriceInfo>{location.price}</PriceInfo>
                    <BookingButton status={location.status}>
                      {location.status === 'occupied' ? '사용중' : '예약하기'}
                    </BookingButton>
                  </div>
                </LocationCard>
              ))}
            </div>
          </MapContainer>
        </DetailedSection>

        {/* 예약 캘린더 */}
        <DetailedSection>
          <DetailedSectionTitle>📅 예약 캘린더</DetailedSectionTitle>
          <CalendarSection>
            <CalendarHeader>
              <h4 style={{ margin: 0, color: '#fff' }}>2024년 1월</h4>
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
                  status={day.status}
                  isToday={day.isToday}
                >
                  {day.date}
                </CalendarDay>
              ))}
            </CalendarGrid>
          </CalendarSection>
        </DetailedSection>

        {/* 리뷰 섹션 */}
        <DetailedSection>
          <DetailedSectionTitle>💬 이용 후기</DetailedSectionTitle>
          <ReviewsSection>
            {reviews.map((review) => (
              <ReviewItem key={review.id}>
                <ReviewHeader>
                  <div>
                    <ReviewerName>{review.reviewer}</ReviewerName>
                    <ReviewDate>{review.date}</ReviewDate>
                  </div>
                  <ReviewRating>{"⭐".repeat(review.rating)}</ReviewRating>
                </ReviewHeader>
                <div style={{ 
                  fontSize: '12px', 
                  color: '#4a90e2',
                  marginBottom: '8px',
                  fontWeight: '500'
                }}>
                  {review.location}
                </div>
                <ReviewText>{review.text}</ReviewText>
              </ReviewItem>
            ))}
          </ReviewsSection>
        </DetailedSection>

        {/* 간단한 오피스 목록 */}
        <DetailedSection>
          <DetailedSectionTitle>🏢 빠른 예약</DetailedSectionTitle>
          <OfficeGrid>
            {offices.map((office) => (
              <OfficeItemComponent key={office.id} office={office} />
            ))}
          </OfficeGrid>
        </DetailedSection>
      </OfficePageContainer>
    );
  }

  // 위젯 뷰 (Overview 페이지용)
  return (
    <OfficeContainer>
      <SectionHeader>
        <SectionTitle>
          제주도 오피스 현황
          <StatusBadge type="available">{availableCount} Available</StatusBadge>
          <StatusBadge type="occupied">{occupiedCount} Occupied</StatusBadge>
        </SectionTitle>
        <RefreshButton onClick={handleRefresh}>🔄</RefreshButton>
      </SectionHeader>

      <OfficeGrid>
        {offices.map((office) => (
          <OfficeItemComponent key={office.id} office={office} />
        ))}
      </OfficeGrid>
    </OfficeContainer>
  );
};

export default OfficeManagementPage;