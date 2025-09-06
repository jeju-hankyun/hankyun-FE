import styled from '@emotion/styled';

export const OfficePageContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 32px;
`;

export const OfficeContainer = styled.div`
  background: rgba(255, 255, 255, 0.08);
  border-radius: 20px;
  padding: 28px;
  margin-bottom: 32px;
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.25);
  transition: all 0.3s cubic-bezier(0.4, 0.0, 0.2, 1);

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 16px 50px rgba(0, 0, 0, 0.35);
    border: 1px solid rgba(255, 255, 255, 0.2);
    background: rgba(255, 255, 255, 0.12);
  }
`;

export const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

export const SectionTitle = styled.h2`
  font-size: 18px;
  font-weight: 600;
  color: #ffffff;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const PageTitle = styled.h1`
  font-size: 28px;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 8px;
  background: linear-gradient(135deg, #4caf50, #81c784);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

export const PageSubtitle = styled.p`
  font-size: 16px;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 32px;
`;

export const StatusBadge = styled.span<{ type: 'available' | 'occupied' }>`
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 10px;
  
  ${props => props.type === 'available' ? `
    background: #4caf50;
    color: white;
  ` : `
    background: #f44336;
    color: white;
  `}
`;

export const RefreshButton = styled.button`
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.5);
  cursor: pointer;
  padding: 8px;
  border-radius: 6px;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    color: rgba(255, 255, 255, 0.8);
  }
`;

export const OfficeGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 16px;
  }
`;

export const OfficeItem = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  padding: 24px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  transition: all 0.3s cubic-bezier(0.4, 0.0, 0.2, 1);
  cursor: pointer;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 4px;
    height: 100%;
    background: linear-gradient(180deg, #4a90e2, #7b68ee);
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover {
    background: rgba(255, 255, 255, 0.08);
    border-color: rgba(255, 255, 255, 0.15);
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);

    &::before {
      opacity: 1;
    }
  }
`;

export const OfficeHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
`;

export const OfficeName = styled.span`
  font-weight: 600;
  color: #ffffff;
  font-size: 16px;
`;

export const OfficeStatusBadge = styled.span<{ status: 'occupied' | 'available' }>`
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 10px;
  font-weight: 600;
  
  ${props => props.status === 'occupied' ? `
    background: #f44336;
    color: white;
  ` : `
    background: #4caf50;
    color: white;
  `}
`;

export const OfficeDescription = styled.div`
  font-size: 13px;
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 16px;
  line-height: 1.4;
`;

export const OfficeMetrics = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 12px;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.5);

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: 8px;
  }
`;

export const MetricItem = styled.span`
  display: flex;
  align-items: center;
  gap: 4px;

  &::before {
    content: '•';
    color: #4a90e2;
  }
`;

export const CheckedInInfo = styled.div`
  margin-top: 12px;
  padding: 8px 12px;
  background: rgba(255, 152, 0, 0.1);
  border-radius: 8px;
  font-size: 12px;
  color: #ff9800;
  border-left: 3px solid #ff9800;
`;

export const DetailedSection = styled.div`
  background: rgba(255, 255, 255, 0.06);
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 24px;
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

export const DetailedSectionTitle = styled.h3`
  font-size: 20px;
  font-weight: 600;
  color: #ffffff;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
`;

export const StatCard = styled.div`
  background: rgba(255, 255, 255, 0.04);
  padding: 20px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  text-align: center;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.08);
    transform: translateY(-2px);
  }
`;

export const StatValue = styled.div`
  font-size: 24px;
  font-weight: 700;
  color: #4a90e2;
  margin-bottom: 4px;
`;

export const StatLabel = styled.div`
  font-size: 12px;
  color: rgba(255, 255, 255, 0.6);
`;

export const MapContainer = styled.div`
  width: 100%;
`;

export const LocationCard = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 20px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.08);
    transform: translateY(-2px);
    border-color: rgba(255, 255, 255, 0.15);
  }
`;

export const LocationHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
`;

export const LocationName = styled.div`
  font-weight: 600;
  color: #ffffff;
  font-size: 16px;
  margin-bottom: 4px;
`;

export const LocationAddress = styled.div`
  font-size: 12px;
  color: rgba(255, 255, 255, 0.5);
`;

export const LocationFeatures = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 12px;
`;

export const FeatureTag = styled.span`
  background: rgba(74, 144, 226, 0.2);
  color: #4a90e2;
  padding: 2px 8px;
  border-radius: 8px;
  font-size: 10px;
  font-weight: 500;
`;

export const PriceInfo = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: #4caf50;
`;

export const BookingButton = styled.button<{ status: 'occupied' | 'available' }>`
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;

  ${props => props.status === 'occupied' ? `
    background: #f44336;
    color: white;
    cursor: not-allowed;
  ` : `
    background: #4caf50;
    color: white;

    &:hover {
      background: #45a049;
      transform: translateY(-1px);
    }
  `}
`;

export const ReviewsSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const ReviewItem = styled.div`
  background: rgba(255, 255, 255, 0.04);
  border-radius: 12px;
  padding: 16px;
  border: 1px solid rgba(255, 255, 255, 0.06);
`;

export const ReviewHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 8px;
`;

export const ReviewerName = styled.div`
  font-weight: 600;
  color: #ffffff;
  font-size: 14px;
`;

export const ReviewDate = styled.div`
  font-size: 11px;
  color: rgba(255, 255, 255, 0.5);
`;

export const ReviewRating = styled.div`
  font-size: 12px;
`;

export const ReviewText = styled.div`
  font-size: 13px;
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.4;
`;

export const CalendarSection = styled.div`
  background: rgba(255, 255, 255, 0.04);
  border-radius: 12px;
  padding: 20px;
  border: 1px solid rgba(255, 255, 255, 0.08);
`;

export const CalendarHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

export const Legend = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
`;

export const LegendItem = styled.div<{ color: string }>`
  display: flex;
  align-items: center;
  font-size: 11px;
  color: rgba(255, 255, 255, 0.6);

  &::before {
    content: '';
    width: 8px;
    height: 8px;
    background: ${props => props.color};
    border-radius: 2px;
    margin-right: 6px;
  }
`;

export const CalendarGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 2px;
`;

export const CalendarDay = styled.div<{ 
  status: 'available' | 'occupied' | 'booked' | 'weekend';
  isToday: boolean;
}>`
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 500;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;

  ${props => {
    switch (props.status) {
      case 'available':
        return `
          background: rgba(76, 175, 80, 0.2);
          color: #4caf50;
        `;
      case 'occupied':
        return `
          background: rgba(244, 67, 54, 0.2);
          color: #f44336;
        `;
      case 'booked':
        return `
          background: rgba(255, 152, 0, 0.2);
          color: #ff9800;
        `;
      case 'weekend':
        return `
          background: rgba(158, 158, 158, 0.2);
          color: #9e9e9e;
        `;
      default:
        return `
          background: rgba(255, 255, 255, 0.05);
          color: rgba(255, 255, 255, 0.7);
        `;
    }
  }}

  ${props => props.isToday && `
    border: 2px solid #4a90e2;
    font-weight: 700;
  `}

  &:hover {
    transform: scale(1.1);
    z-index: 1;
  }
`;