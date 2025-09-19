import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useParams } from 'react-router-dom';
import { createTrip, getTourApiCongestionData } from '../../../auth/api';
import type { CreateTripRequest, BaseResponse, TripResponse, TourApiItem } from '../../../auth/api/interfaces';

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

const FormCard = styled.div`
  background: white;
  padding: 32px;
  border-radius: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  margin-bottom: 24px;
  border: 1px solid #f1f5f9;
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
`;

const CardTitle = styled.h2`
  font-size: 20px;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 24px 0;
  display: flex;
  align-items: center;
  gap: 8px;
  
  &::before {
    content: '✈️';
    font-size: 18px;
  }
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
  
  label {
    display: block;
    margin-bottom: 8px;
    font-weight: 600;
    color: #374151;
    font-size: 14px;
  }
  
  input[type="text"],
  input[type="date"] {
    width: 100%;
    padding: 12px 16px;
    border: 2px solid #e5e7eb;
    border-radius: 12px;
    font-size: 16px;
    transition: all 0.2s ease;
    background: #ffffff;
    
    &:focus {
      outline: none;
      border-color: #7c3aed;
      box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.1);
    }
    
    &::placeholder {
      color: #9ca3af;
    }
  }
`;

const SubmitButton = styled.button`
  background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
  color: white;
  padding: 16px 24px;
  border: none;
  border-radius: 16px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 600;
  width: 100%;
  margin-top: 16px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 20px rgba(139, 92, 246, 0.3);
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 30px rgba(139, 92, 246, 0.4);
  }
  
  &:active {
    transform: translateY(0);
  }
  
  &:disabled {
    background: #d1d5db;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

const MessageText = styled.p<{ isError?: boolean }>`
  margin-top: 16px;
  padding: 12px 16px;
  border-radius: 8px;
  font-weight: 500;
  background: ${props => props.isError ? '#fef2f2' : '#f0fdf4'};
  color: ${props => props.isError ? '#dc2626' : '#16a34a'};
  border: 1px solid ${props => props.isError ? '#fecaca' : '#bbf7d0'};
`;

const CongestionSection = styled.div`
  background: #ffffff;
  padding: 32px;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  margin-bottom: 24px;
  border: 1px solid #e2e8f0;
`;

const CongestionTitle = styled.h3`
  font-size: 20px;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 24px 0;
  display: flex;
  align-items: center;
  gap: 8px;
  
  &::before {
    content: '📊';
    font-size: 18px;
  }
`;

const CongestionChart = styled.div`
  display: flex;
  align-items: end;
  gap: 8px;
  height: 320px;
  margin-bottom: 24px;
  padding: 24px 24px 24px 60px;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  border-radius: 16px;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.06);
  position: relative;
  overflow: visible;
  border: 1px solid #e2e8f0;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(45deg, transparent 30%, rgba(124, 58, 237, 0.02) 50%, transparent 70%);
    border-radius: 16px;
    pointer-events: none;
  }
`;

const BarContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  height: 100%;
  flex: 1;
  position: relative;
`;

const YAxis = styled.div`
  position: absolute;
  left: 16px;
  top: 24px;
  bottom: 24px;
  width: 40px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-end;
`;

const YAxisLabel = styled.div`
  color: #64748b;
  font-size: 12px;
  font-weight: 600;
  line-height: 1;
  transform: translateY(50%);
`;

const YAxisLine = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  height: 1px;
  background: rgba(100, 116, 139, 0.2);
  pointer-events: none;
`;

const CongestionBar = styled.div<{ height: number; isSelected?: boolean; congestion: number }>`
  background: ${props => {
    if (props.isSelected) {
      return 'linear-gradient(180deg, #7c3aed 0%, #5b21b6 100%)';
    }
    if (props.congestion >= 80) {
      return 'linear-gradient(180deg, #ef4444 0%, #dc2626 100%)';
    } else if (props.congestion >= 60) {
      return 'linear-gradient(180deg, #f59e0b 0%, #d97706 100%)';
    } else if (props.congestion >= 40) {
      return 'linear-gradient(180deg, #3b82f6 0%, #2563eb 100%)';
    } else {
      return 'linear-gradient(180deg, #10b981 0%, #059669 100%)';
    }
  }};
  border-radius: 12px 12px 0 0;
  height: ${props => Math.max(props.height * 2.8, 6)}px;
  min-height: 6px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  box-shadow: ${props => props.isSelected 
    ? '0 0 20px rgba(124, 58, 237, 0.4), 0 4px 12px rgba(0, 0, 0, 0.15)' 
    : '0 2px 8px rgba(0, 0, 0, 0.1)'};
  
  &:hover {
    transform: translateY(-2px) scale(1.02);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
    z-index: 10;
  }
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.6), transparent);
    border-radius: 12px 12px 0 0;
  }
  
  &::after {
    content: '';
    position: absolute;
    top: -8px;
    left: 50%;
    transform: translateX(-50%);
    width: 0;
    height: 0;
    border-left: 4px solid transparent;
    border-right: 4px solid transparent;
    border-bottom: 8px solid ${props => props.isSelected ? '#5b21b6' : 'transparent'};
    opacity: ${props => props.isSelected ? 1 : 0};
    transition: all 0.3s ease;
  }
`;

const CongestionLabel = styled.div`
  position: absolute;
  bottom: -40px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 12px;
  color: #64748b;
  font-weight: 600;
  white-space: nowrap;
  text-align: center;
`;

const Tooltip = styled.div<{ show: boolean }>`
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  background: #1e293b;
  color: white;
  padding: 12px 16px;
  border-radius: 12px;
  font-size: 13px;
  font-weight: 500;
  white-space: nowrap;
  opacity: ${props => props.show ? 1 : 0};
  visibility: ${props => props.show ? 'visible' : 'hidden'};
  transition: all 0.3s ease;
  z-index: 20;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  margin-bottom: 12px;
  border: 1px solid #334155;
  
  &::after {
    content: '';
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    width: 0;
    height: 0;
    border-left: 6px solid transparent;
    border-right: 6px solid transparent;
    border-top: 6px solid #1e293b;
  }
`;

const RecommendationCard = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 24px;
  padding: 20px;
  background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
  border-radius: 16px;
  border: 1px solid #bbf7d0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
`;

const RecommendationInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const RecommendationLabel = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #166534;
`;

const RecommendationValue = styled.div`
  font-size: 18px;
  font-weight: 700;
  color: #15803d;
`;

const LoadingSpinner = styled.div`
  display: inline-block;
  width: 40px;
  height: 40px;
  border: 4px solid #e5e7eb;
  border-top: 4px solid #7c3aed;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const CreateTripPage: React.FC = () => {
  const { workcationGroupId } = useParams<{ workcationGroupId: string }>();
  const [place, setPlace] = useState<string>('');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [isError, setIsError] = useState(false);
  
  // 혼잡도 데이터 관련 상태
  const [congestionData, setCongestionData] = useState<TourApiItem[]>([]);
  const [congestionLoading, setCongestionLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>('');

  // 혼잡도 데이터 가져오기 (실제 TourAPI 사용)
  const fetchCongestionData = async (placeName: string) => {
    if (!placeName.trim()) return;
    
    try {
      setCongestionLoading(true);
      
      
      // 한국 행정구역 코드표 기반 완전한 매핑
      const getAreaAndSignguCode = (place: string) => {
        const placeLower = place.toLowerCase();
        
        // 서울특별시 (11)
        if (placeLower.includes('서울') || placeLower.includes('seoul')) {
          if (placeLower.includes('종로')) return { areaCd: '11', signguCd: '11110' };
          if (placeLower.includes('중구')) return { areaCd: '11', signguCd: '11140' };
          if (placeLower.includes('용산')) return { areaCd: '11', signguCd: '11170' };
          if (placeLower.includes('성동')) return { areaCd: '11', signguCd: '11200' };
          if (placeLower.includes('광진')) return { areaCd: '11', signguCd: '11215' };
          if (placeLower.includes('동대문')) return { areaCd: '11', signguCd: '11230' };
          if (placeLower.includes('중랑')) return { areaCd: '11', signguCd: '11260' };
          if (placeLower.includes('성북')) return { areaCd: '11', signguCd: '11290' };
          if (placeLower.includes('강북')) return { areaCd: '11', signguCd: '11305' };
          if (placeLower.includes('도봉')) return { areaCd: '11', signguCd: '11320' };
          if (placeLower.includes('노원')) return { areaCd: '11', signguCd: '11350' };
          if (placeLower.includes('은평')) return { areaCd: '11', signguCd: '11380' };
          if (placeLower.includes('서대문')) return { areaCd: '11', signguCd: '11410' };
          if (placeLower.includes('마포')) return { areaCd: '11', signguCd: '11440' };
          if (placeLower.includes('양천')) return { areaCd: '11', signguCd: '11470' };
          if (placeLower.includes('강서')) return { areaCd: '11', signguCd: '11500' };
          if (placeLower.includes('구로')) return { areaCd: '11', signguCd: '11530' };
          if (placeLower.includes('금천')) return { areaCd: '11', signguCd: '11545' };
          if (placeLower.includes('영등포')) return { areaCd: '11', signguCd: '11560' };
          if (placeLower.includes('동작')) return { areaCd: '11', signguCd: '11590' };
          if (placeLower.includes('관악')) return { areaCd: '11', signguCd: '11620' };
          if (placeLower.includes('서초')) return { areaCd: '11', signguCd: '11650' };
          if (placeLower.includes('강남')) return { areaCd: '11', signguCd: '11680' };
          if (placeLower.includes('송파')) return { areaCd: '11', signguCd: '11710' };
          if (placeLower.includes('강동')) return { areaCd: '11', signguCd: '11740' };
          return { areaCd: '11', signguCd: '11110' }; // 기본: 종로구
        }
        
        // 부산광역시 (26)
        if (placeLower.includes('부산') || placeLower.includes('busan')) {
          if (placeLower.includes('중구')) return { areaCd: '26', signguCd: '26110' };
          if (placeLower.includes('서구')) return { areaCd: '26', signguCd: '26140' };
          if (placeLower.includes('동구')) return { areaCd: '26', signguCd: '26170' };
          if (placeLower.includes('영도')) return { areaCd: '26', signguCd: '26200' };
          if (placeLower.includes('부산진')) return { areaCd: '26', signguCd: '26230' };
          if (placeLower.includes('동래')) return { areaCd: '26', signguCd: '26260' };
          if (placeLower.includes('남구')) return { areaCd: '26', signguCd: '26290' };
          if (placeLower.includes('북구')) return { areaCd: '26', signguCd: '26320' };
          if (placeLower.includes('해운대')) return { areaCd: '26', signguCd: '26350' };
          if (placeLower.includes('사하')) return { areaCd: '26', signguCd: '26380' };
          if (placeLower.includes('금정')) return { areaCd: '26', signguCd: '26410' };
          if (placeLower.includes('강서')) return { areaCd: '26', signguCd: '26440' };
          if (placeLower.includes('연제')) return { areaCd: '26', signguCd: '26470' };
          if (placeLower.includes('수영')) return { areaCd: '26', signguCd: '26500' };
          if (placeLower.includes('사상')) return { areaCd: '26', signguCd: '26530' };
          if (placeLower.includes('기장')) return { areaCd: '26', signguCd: '26710' };
          return { areaCd: '26', signguCd: '26110' }; // 기본: 중구
        }
        
        // 대구광역시 (27)
        if (placeLower.includes('대구') || placeLower.includes('daegu')) {
          if (placeLower.includes('중구')) return { areaCd: '27', signguCd: '27110' };
          if (placeLower.includes('동구')) return { areaCd: '27', signguCd: '27140' };
          if (placeLower.includes('서구')) return { areaCd: '27', signguCd: '27170' };
          if (placeLower.includes('남구')) return { areaCd: '27', signguCd: '27200' };
          if (placeLower.includes('북구')) return { areaCd: '27', signguCd: '27230' };
          if (placeLower.includes('수성')) return { areaCd: '27', signguCd: '27260' };
          if (placeLower.includes('달서')) return { areaCd: '27', signguCd: '27290' };
          if (placeLower.includes('달성')) return { areaCd: '27', signguCd: '27710' };
          return { areaCd: '27', signguCd: '27110' }; // 기본: 중구
        }
        
        // 인천광역시 (28)
        if (placeLower.includes('인천') || placeLower.includes('incheon')) {
          if (placeLower.includes('중구')) return { areaCd: '28', signguCd: '28110' };
          if (placeLower.includes('동구')) return { areaCd: '28', signguCd: '28140' };
          if (placeLower.includes('미추홀')) return { areaCd: '28', signguCd: '28177' };
          if (placeLower.includes('연수')) return { areaCd: '28', signguCd: '28185' };
          if (placeLower.includes('남동')) return { areaCd: '28', signguCd: '28200' };
          if (placeLower.includes('부평')) return { areaCd: '28', signguCd: '28237' };
          if (placeLower.includes('계양')) return { areaCd: '28', signguCd: '28245' };
          if (placeLower.includes('서구')) return { areaCd: '28', signguCd: '28260' };
          if (placeLower.includes('강화')) return { areaCd: '28', signguCd: '28710' };
          if (placeLower.includes('옹진')) return { areaCd: '28', signguCd: '28720' };
          return { areaCd: '28', signguCd: '28110' }; // 기본: 중구
        }
        
        // 광주광역시 (29)
        if (placeLower.includes('광주') || placeLower.includes('gwangju')) {
          if (placeLower.includes('동구')) return { areaCd: '29', signguCd: '29110' };
          if (placeLower.includes('서구')) return { areaCd: '29', signguCd: '29140' };
          if (placeLower.includes('남구')) return { areaCd: '29', signguCd: '29170' };
          if (placeLower.includes('북구')) return { areaCd: '29', signguCd: '29200' };
          if (placeLower.includes('광산')) return { areaCd: '29', signguCd: '29230' };
          return { areaCd: '29', signguCd: '29110' }; // 기본: 동구
        }
        
        // 대전광역시 (30)
        if (placeLower.includes('대전') || placeLower.includes('daejeon')) {
          if (placeLower.includes('동구')) return { areaCd: '30', signguCd: '30110' };
          if (placeLower.includes('중구')) return { areaCd: '30', signguCd: '30140' };
          if (placeLower.includes('서구')) return { areaCd: '30', signguCd: '30170' };
          if (placeLower.includes('유성')) return { areaCd: '30', signguCd: '30200' };
          if (placeLower.includes('대덕')) return { areaCd: '30', signguCd: '30230' };
          return { areaCd: '30', signguCd: '30110' }; // 기본: 동구
        }
        
        // 울산광역시 (31)
        if (placeLower.includes('울산') || placeLower.includes('ulsan')) {
          if (placeLower.includes('중구')) return { areaCd: '31', signguCd: '31110' };
          if (placeLower.includes('남구')) return { areaCd: '31', signguCd: '31140' };
          if (placeLower.includes('동구')) return { areaCd: '31', signguCd: '31170' };
          if (placeLower.includes('북구')) return { areaCd: '31', signguCd: '31200' };
          if (placeLower.includes('울주')) return { areaCd: '31', signguCd: '31710' };
          return { areaCd: '31', signguCd: '31110' }; // 기본: 중구
        }
        
        // 세종특별자치시 (36)
        if (placeLower.includes('세종') || placeLower.includes('sejong')) {
          return { areaCd: '36', signguCd: '36010' };
        }
        
        // 경기도 (41)
        if (placeLower.includes('경기') || placeLower.includes('gyeonggi')) {
          if (placeLower.includes('수원')) return { areaCd: '41', signguCd: '41111' };
          if (placeLower.includes('성남')) return { areaCd: '41', signguCd: '41131' };
          if (placeLower.includes('의정부')) return { areaCd: '41', signguCd: '41150' };
          if (placeLower.includes('안양')) return { areaCd: '41', signguCd: '41171' };
          if (placeLower.includes('부천')) return { areaCd: '41', signguCd: '41190' };
          if (placeLower.includes('광명')) return { areaCd: '41', signguCd: '41210' };
          if (placeLower.includes('평택')) return { areaCd: '41', signguCd: '41220' };
          if (placeLower.includes('과천')) return { areaCd: '41', signguCd: '41250' };
          if (placeLower.includes('오산')) return { areaCd: '41', signguCd: '41271' };
          if (placeLower.includes('시흥')) return { areaCd: '41', signguCd: '41290' };
          if (placeLower.includes('군포')) return { areaCd: '41', signguCd: '41310' };
          if (placeLower.includes('의왕')) return { areaCd: '41', signguCd: '41330' };
          if (placeLower.includes('하남')) return { areaCd: '41', signguCd: '41350' };
          if (placeLower.includes('용인')) return { areaCd: '41', signguCd: '41461' };
          if (placeLower.includes('파주')) return { areaCd: '41', signguCd: '41480' };
          if (placeLower.includes('이천')) return { areaCd: '41', signguCd: '41500' };
          if (placeLower.includes('안성')) return { areaCd: '41', signguCd: '41550' };
          if (placeLower.includes('김포')) return { areaCd: '41', signguCd: '41570' };
          if (placeLower.includes('화성')) return { areaCd: '41', signguCd: '41590' };
          if (placeLower.includes('광주')) return { areaCd: '41', signguCd: '41610' };
          if (placeLower.includes('여주')) return { areaCd: '41', signguCd: '41630' };
          if (placeLower.includes('양평')) return { areaCd: '41', signguCd: '41830' };
          if (placeLower.includes('고양')) return { areaCd: '41', signguCd: '41281' };
          if (placeLower.includes('동두천')) return { areaCd: '41', signguCd: '41250' };
          if (placeLower.includes('가평')) return { areaCd: '41', signguCd: '41820' };
          if (placeLower.includes('연천')) return { areaCd: '41', signguCd: '41800' };
          return { areaCd: '41', signguCd: '41111' }; // 기본: 수원시
        }
        
        // 충청북도 (43)
        if (placeLower.includes('충북') || placeLower.includes('chungbuk')) {
          if (placeLower.includes('청주')) return { areaCd: '43', signguCd: '43111' };
          if (placeLower.includes('충주')) return { areaCd: '43', signguCd: '43130' };
          if (placeLower.includes('제천')) return { areaCd: '43', signguCd: '43150' };
          if (placeLower.includes('보은')) return { areaCd: '43', signguCd: '43720' };
          if (placeLower.includes('옥천')) return { areaCd: '43', signguCd: '43730' };
          if (placeLower.includes('영동')) return { areaCd: '43', signguCd: '43740' };
          if (placeLower.includes('증평')) return { areaCd: '43', signguCd: '43745' };
          if (placeLower.includes('진천')) return { areaCd: '43', signguCd: '43750' };
          if (placeLower.includes('괴산')) return { areaCd: '43', signguCd: '43760' };
          if (placeLower.includes('음성')) return { areaCd: '43', signguCd: '43770' };
          if (placeLower.includes('단양')) return { areaCd: '43', signguCd: '43800' };
          return { areaCd: '43', signguCd: '43111' }; // 기본: 청주시
        }
        
        // 충청남도 (44)
        if (placeLower.includes('충남') || placeLower.includes('chungnam')) {
          if (placeLower.includes('천안')) return { areaCd: '44', signguCd: '44131' };
          if (placeLower.includes('공주')) return { areaCd: '44', signguCd: '44150' };
          if (placeLower.includes('보령')) return { areaCd: '44', signguCd: '44180' };
          if (placeLower.includes('아산')) return { areaCd: '44', signguCd: '44200' };
          if (placeLower.includes('서산')) return { areaCd: '44', signguCd: '44210' };
          if (placeLower.includes('논산')) return { areaCd: '44', signguCd: '44230' };
          if (placeLower.includes('계룡')) return { areaCd: '44', signguCd: '44250' };
          if (placeLower.includes('당진')) return { areaCd: '44', signguCd: '44270' };
          if (placeLower.includes('금산')) return { areaCd: '44', signguCd: '44710' };
          if (placeLower.includes('부여')) return { areaCd: '44', signguCd: '44760' };
          if (placeLower.includes('서천')) return { areaCd: '44', signguCd: '44770' };
          if (placeLower.includes('청양')) return { areaCd: '44', signguCd: '44790' };
          if (placeLower.includes('홍성')) return { areaCd: '44', signguCd: '44800' };
          if (placeLower.includes('예산')) return { areaCd: '44', signguCd: '44810' };
          if (placeLower.includes('태안')) return { areaCd: '44', signguCd: '44825' };
          return { areaCd: '44', signguCd: '44131' }; // 기본: 천안시
        }
        
        // 전라북도 (45)
        if (placeLower.includes('전북') || placeLower.includes('jeonbuk')) {
          if (placeLower.includes('전주')) return { areaCd: '45', signguCd: '45111' };
          if (placeLower.includes('군산')) return { areaCd: '45', signguCd: '45130' };
          if (placeLower.includes('익산')) return { areaCd: '45', signguCd: '45140' };
          if (placeLower.includes('정읍')) return { areaCd: '45', signguCd: '45180' };
          if (placeLower.includes('남원')) return { areaCd: '45', signguCd: '45190' };
          if (placeLower.includes('김제')) return { areaCd: '45', signguCd: '45210' };
          if (placeLower.includes('완주')) return { areaCd: '45', signguCd: '45710' };
          if (placeLower.includes('진안')) return { areaCd: '45', signguCd: '45720' };
          if (placeLower.includes('무주')) return { areaCd: '45', signguCd: '45730' };
          if (placeLower.includes('장수')) return { areaCd: '45', signguCd: '45740' };
          if (placeLower.includes('임실')) return { areaCd: '45', signguCd: '45750' };
          if (placeLower.includes('순창')) return { areaCd: '45', signguCd: '45770' };
          if (placeLower.includes('고창')) return { areaCd: '45', signguCd: '45790' };
          if (placeLower.includes('부안')) return { areaCd: '45', signguCd: '45800' };
          return { areaCd: '45', signguCd: '45111' }; // 기본: 전주시
        }
        
        // 전라남도 (46)
        if (placeLower.includes('전남') || placeLower.includes('jeonnam')) {
          if (placeLower.includes('목포')) return { areaCd: '46', signguCd: '46110' };
          if (placeLower.includes('여수')) return { areaCd: '46', signguCd: '46130' };
          if (placeLower.includes('순천')) return { areaCd: '46', signguCd: '46150' };
          if (placeLower.includes('나주')) return { areaCd: '46', signguCd: '46170' };
          if (placeLower.includes('광양')) return { areaCd: '46', signguCd: '46230' };
          if (placeLower.includes('담양')) return { areaCd: '46', signguCd: '46710' };
          if (placeLower.includes('곡성')) return { areaCd: '46', signguCd: '46720' };
          if (placeLower.includes('구례')) return { areaCd: '46', signguCd: '46730' };
          if (placeLower.includes('고흥')) return { areaCd: '46', signguCd: '46770' };
          if (placeLower.includes('보성')) return { areaCd: '46', signguCd: '46780' };
          if (placeLower.includes('화순')) return { areaCd: '46', signguCd: '46790' };
          if (placeLower.includes('장흥')) return { areaCd: '46', signguCd: '46800' };
          if (placeLower.includes('강진')) return { areaCd: '46', signguCd: '46810' };
          if (placeLower.includes('해남')) return { areaCd: '46', signguCd: '46820' };
          if (placeLower.includes('영암')) return { areaCd: '46', signguCd: '46830' };
          if (placeLower.includes('무안')) return { areaCd: '46', signguCd: '46840' };
          if (placeLower.includes('함평')) return { areaCd: '46', signguCd: '46860' };
          if (placeLower.includes('영광')) return { areaCd: '46', signguCd: '46870' };
          if (placeLower.includes('장성')) return { areaCd: '46', signguCd: '46880' };
          if (placeLower.includes('완도')) return { areaCd: '46', signguCd: '46890' };
          if (placeLower.includes('진도')) return { areaCd: '46', signguCd: '46900' };
          if (placeLower.includes('신안')) return { areaCd: '46', signguCd: '46910' };
          return { areaCd: '46', signguCd: '46110' }; // 기본: 목포시
        }
        
        // 경상북도 (47)
        if (placeLower.includes('경북') || placeLower.includes('gyeongbuk')) {
          if (placeLower.includes('포항')) return { areaCd: '47', signguCd: '47111' };
          if (placeLower.includes('경주')) return { areaCd: '47', signguCd: '47130' };
          if (placeLower.includes('김천')) return { areaCd: '47', signguCd: '47150' };
          if (placeLower.includes('안동')) return { areaCd: '47', signguCd: '47170' };
          if (placeLower.includes('구미')) return { areaCd: '47', signguCd: '47190' };
          if (placeLower.includes('영주')) return { areaCd: '47', signguCd: '47210' };
          if (placeLower.includes('영천')) return { areaCd: '47', signguCd: '47230' };
          if (placeLower.includes('상주')) return { areaCd: '47', signguCd: '47250' };
          if (placeLower.includes('문경')) return { areaCd: '47', signguCd: '47280' };
          if (placeLower.includes('경산')) return { areaCd: '47', signguCd: '47290' };
          if (placeLower.includes('군위')) return { areaCd: '47', signguCd: '47720' };
          if (placeLower.includes('의성')) return { areaCd: '47', signguCd: '47730' };
          if (placeLower.includes('청송')) return { areaCd: '47', signguCd: '47750' };
          if (placeLower.includes('영양')) return { areaCd: '47', signguCd: '47760' };
          if (placeLower.includes('영덕')) return { areaCd: '47', signguCd: '47770' };
          if (placeLower.includes('청도')) return { areaCd: '47', signguCd: '47820' };
          if (placeLower.includes('고령')) return { areaCd: '47', signguCd: '47830' };
          if (placeLower.includes('성주')) return { areaCd: '47', signguCd: '47840' };
          if (placeLower.includes('칠곡')) return { areaCd: '47', signguCd: '47850' };
          if (placeLower.includes('예천')) return { areaCd: '47', signguCd: '47900' };
          if (placeLower.includes('봉화')) return { areaCd: '47', signguCd: '47920' };
          if (placeLower.includes('울진')) return { areaCd: '47', signguCd: '47930' };
          if (placeLower.includes('울릉')) return { areaCd: '47', signguCd: '47940' };
          return { areaCd: '47', signguCd: '47111' }; // 기본: 포항시
        }
        
        // 경상남도 (48)
        if (placeLower.includes('경남') || placeLower.includes('gyeongnam')) {
          if (placeLower.includes('창원')) return { areaCd: '48', signguCd: '48121' };
          if (placeLower.includes('진주')) return { areaCd: '48', signguCd: '48170' };
          if (placeLower.includes('통영')) return { areaCd: '48', signguCd: '48220' };
          if (placeLower.includes('사천')) return { areaCd: '48', signguCd: '48240' };
          if (placeLower.includes('김해')) return { areaCd: '48', signguCd: '48250' };
          if (placeLower.includes('밀양')) return { areaCd: '48', signguCd: '48270' };
          if (placeLower.includes('거제')) return { areaCd: '48', signguCd: '48310' };
          if (placeLower.includes('양산')) return { areaCd: '48', signguCd: '48330' };
          if (placeLower.includes('의령')) return { areaCd: '48', signguCd: '48720' };
          if (placeLower.includes('함안')) return { areaCd: '48', signguCd: '48730' };
          if (placeLower.includes('창녕')) return { areaCd: '48', signguCd: '48740' };
          if (placeLower.includes('고성')) return { areaCd: '48', signguCd: '48820' };
          if (placeLower.includes('남해')) return { areaCd: '48', signguCd: '48840' };
          if (placeLower.includes('하동')) return { areaCd: '48', signguCd: '48850' };
          if (placeLower.includes('산청')) return { areaCd: '48', signguCd: '48860' };
          if (placeLower.includes('함양')) return { areaCd: '48', signguCd: '48870' };
          if (placeLower.includes('거창')) return { areaCd: '48', signguCd: '48880' };
          if (placeLower.includes('합천')) return { areaCd: '48', signguCd: '48890' };
          return { areaCd: '48', signguCd: '48121' }; // 기본: 창원시
        }
        
        // 제주특별자치도 (50)
        if (placeLower.includes('제주') || placeLower.includes('jeju')) {
          if (placeLower.includes('서귀포')) return { areaCd: '50', signguCd: '50130' };
          return { areaCd: '50', signguCd: '50110' }; // 기본: 제주시
        }
        
        // 강원특별자치도 (51)
        if (placeLower.includes('강원') || placeLower.includes('gangwon')) {
          if (placeLower.includes('춘천')) return { areaCd: '51', signguCd: '51110' };
          if (placeLower.includes('원주')) return { areaCd: '51', signguCd: '51130' };
          if (placeLower.includes('강릉')) return { areaCd: '51', signguCd: '51150' };
          if (placeLower.includes('동해')) return { areaCd: '51', signguCd: '51170' };
          if (placeLower.includes('태백')) return { areaCd: '51', signguCd: '51190' };
          if (placeLower.includes('속초')) return { areaCd: '51', signguCd: '51210' };
          if (placeLower.includes('삼척')) return { areaCd: '51', signguCd: '51230' };
          if (placeLower.includes('홍천')) return { areaCd: '51', signguCd: '51720' };
          if (placeLower.includes('횡성')) return { areaCd: '51', signguCd: '51730' };
          if (placeLower.includes('영월')) return { areaCd: '51', signguCd: '51750' };
          if (placeLower.includes('평창')) return { areaCd: '51', signguCd: '51760' };
          if (placeLower.includes('정선')) return { areaCd: '51', signguCd: '51770' };
          if (placeLower.includes('철원')) return { areaCd: '51', signguCd: '51780' };
          if (placeLower.includes('화천')) return { areaCd: '51', signguCd: '51790' };
          if (placeLower.includes('양구')) return { areaCd: '51', signguCd: '51800' };
          if (placeLower.includes('인제')) return { areaCd: '51', signguCd: '51810' };
          if (placeLower.includes('고성')) return { areaCd: '51', signguCd: '51820' };
          if (placeLower.includes('양양')) return { areaCd: '51', signguCd: '51830' };
          return { areaCd: '51', signguCd: '51110' }; // 기본: 춘천시
        }
        
        // 전북특별자치도 (52)
        if (placeLower.includes('전북특별') || placeLower.includes('jeonbuk special')) {
          return { areaCd: '52', signguCd: '52110' };
        }
        
        // 기본값: 제주특별자치도 제주시
        return { areaCd: '50', signguCd: '50110' };
      };
      
      const { areaCd, signguCd } = getAreaAndSignguCode(placeName);
      
      console.log('TourAPI 호출:', { areaCd, signguCd });
      
      const response = await getTourApiCongestionData({
        areaCd: areaCd,
        signguCd: signguCd,
        numOfRows: 30
      });
      
      console.log('TourAPI 응답:', response);
      
      if (response.response.body.items && response.response.body.items.item && response.response.body.items.item.length > 0) {
        setCongestionData(response.response.body.items.item);
        // 가장 혼잡도가 낮은 날 찾기
        const bestDay = response.response.body.items.item.reduce((min: TourApiItem, current: TourApiItem) => 
          parseFloat(current.cnctrRate) < parseFloat(min.cnctrRate) ? current : min
        );
        setSelectedDate(bestDay.baseYmd);
      } else {
        // 데이터가 없는 경우 빈 배열로 설정
        setCongestionData([]);
        console.log('혼잡도 데이터가 없습니다. 다른 관광지명을 시도해보세요.');
      }
    } catch (error) {
      console.error('혼잡도 데이터 조회 실패:', error);
      setCongestionData([]);
    } finally {
      setCongestionLoading(false);
    }
  };

  // 장소 입력이 변경될 때 혼잡도 데이터 가져오기
  useEffect(() => {
    if (place.trim()) {
      const timeoutId = setTimeout(() => {
        fetchCongestionData(place);
      }, 1000); // 1초 후 API 호출 (디바운싱)
      
      return () => clearTimeout(timeoutId);
    }
  }, [place]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!workcationGroupId) {
      setMessage('워케이션 그룹 ID가 필요합니다.');
      setIsError(true);
      return;
    }
    if (!place || !startDate || !endDate) {
      setMessage('모든 필드를 입력해주세요.');
      setIsError(true);
      return;
    }

    const data: CreateTripRequest = {
      place,
      start_date: startDate,
      end_date: endDate,
    };

    try {
      setLoading(true);
      setMessage(null);
      setIsError(false);
      const response: BaseResponse<TripResponse> = await createTrip(parseInt(workcationGroupId, 10), data);
      console.log('Trip 생성 응답:', response);
      console.log('response.data:', response.data);
      console.log('response.data 존재 여부:', !!response.data);
      
      if (response.data) {
        const successMessage = `Trip '${response.data.trip_id}'가 성공적으로 생성되었습니다.`;
        console.log('성공 메시지 설정:', successMessage);
        setMessage(successMessage);
        setIsError(false);
        // 폼 초기화 (성공 시)
        setPlace('');
        setStartDate('');
        setEndDate('');
      } else {
        const errorMessage = response.message || 'Trip 생성에 실패했습니다.';
        console.log('실패 메시지 설정:', errorMessage);
        setMessage(errorMessage);
        setIsError(true);
      }
    } catch (error: any) {
      console.error('Error creating trip:', error);
      // 500 오류에 대한 더 명확한 메시지 제공
      if (error.response?.status === 500) {
        setMessage('서버 내부 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
      } else if (error.response?.status === 404) {
        setMessage('Trip 생성 API가 아직 구현되지 않았습니다.');
      } else {
        setMessage('Trip 생성 중 오류가 발생했습니다.');
      }
      setIsError(true);
    } finally {
      setLoading(false);
    }
  };

  // 혼잡도 차트 렌더링
  const renderCongestionChart = () => {
    if (congestionLoading) {
      return (
        <div style={{ textAlign: 'center', padding: '60px 20px' }}>
          <LoadingSpinner />
          <p style={{ marginTop: '20px', color: '#64748b', fontSize: '16px', fontWeight: '500' }}>
            혼잡도 데이터를 불러오는 중...
          </p>
        </div>
      );
    }
    
    if (congestionData.length === 0) {
      return (
        <div style={{ textAlign: 'center', padding: '60px 20px' }}>
          <div style={{ 
            fontSize: '48px', 
            marginBottom: '16px',
            opacity: 0.5
          }}>📊</div>
          <p style={{ color: '#64748b', marginBottom: '12px', fontSize: '16px', fontWeight: '500' }}>
            혼잡도 데이터가 없습니다
          </p>
          <p style={{ fontSize: '14px', color: '#94a3b8', lineHeight: '1.5' }}>
            💡 팁: 지역명을 입력해보세요<br/>
            예: "서울", "부산", "제주도", "경주", "강원도" 등
          </p>
        </div>
      );
    }

    const bestDay = congestionData.reduce((min, current) => 
      parseFloat(current.cnctrRate) < parseFloat(min.cnctrRate) ? current : min
    );

    return (
      <>
        <CongestionChart>
          {/* Y축 눈금 */}
          <YAxis>
            <YAxisLabel>100%</YAxisLabel>
            <YAxisLine style={{ top: '20px' }} />
            <YAxisLabel>75%</YAxisLabel>
            <YAxisLine style={{ top: '25%' }} />
            <YAxisLabel>50%</YAxisLabel>
            <YAxisLine style={{ top: '50%' }} />
            <YAxisLabel>25%</YAxisLabel>
            <YAxisLine style={{ top: '75%' }} />
            <YAxisLabel>0%</YAxisLabel>
          </YAxis>
          
          {congestionData.slice(0, 14).map((item, index) => {
            const congestion = parseFloat(item.cnctrRate);
            const height = congestion; // 0~100% 절대 기준으로 높이 설정
            const isSelected = item.baseYmd === selectedDate;
            const date = new Date(item.baseYmd);
            const dayName = ['일', '월', '화', '수', '목', '금', '토'][date.getDay()];
            
            return (
              <BarContainer key={index}>
                <CongestionBar
                  height={height}
                  isSelected={isSelected}
                  congestion={congestion}
                  onClick={() => setSelectedDate(item.baseYmd)}
                />
                <CongestionLabel>
                  {item.baseYmd.split('-')[2]}<br/>
                  <span style={{ fontSize: '9px', opacity: 0.8 }}>({dayName})</span>
                </CongestionLabel>
                <Tooltip show={isSelected}>
                  {item.baseYmd}<br/>
                  혼잡도: {congestion.toFixed(1)}%
                </Tooltip>
              </BarContainer>
            );
          })}
        </CongestionChart>
        
        <RecommendationCard>
          <RecommendationInfo>
            <RecommendationLabel>🎯 추천 날짜</RecommendationLabel>
            <RecommendationValue>{bestDay.baseYmd}</RecommendationValue>
          </RecommendationInfo>
          <RecommendationInfo style={{ textAlign: 'right' }}>
            <RecommendationLabel>혼잡도</RecommendationLabel>
            <RecommendationValue>{bestDay.cnctrRate}%</RecommendationValue>
          </RecommendationInfo>
        </RecommendationCard>
      </>
    );
  };

  return (
    <PageContainer>
      <PageHeader>
        <PageTitle>Trip 생성</PageTitle>
        <PageSubtitle>워케이션 그룹 ID: {workcationGroupId}</PageSubtitle>
      </PageHeader>
      
      <FormCard>
        <CardTitle>Trip 정보 입력</CardTitle>
        <form onSubmit={handleSubmit}>
          <FormGroup>
            <label htmlFor="place">목적지</label>
            <input
              id="place"
              type="text"
              value={place}
              onChange={(e) => setPlace(e.target.value)}
              disabled={loading}
              placeholder="예: 제주도, 서울, 부산"
            />
          </FormGroup>
          <FormGroup>
            <label htmlFor="startDate">시작일</label>
            <input
              id="startDate"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              disabled={loading}
            />
          </FormGroup>
          <FormGroup>
            <label htmlFor="endDate">종료일</label>
            <input
              id="endDate"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              disabled={loading}
            />
          </FormGroup>
          <SubmitButton type="submit" disabled={loading}>
            {loading ? '생성 중...' : 'Trip 생성하기'}
          </SubmitButton>
          {message && <MessageText isError={isError}>{message}</MessageText>}
        </form>
      </FormCard>
      
      {/* 혼잡도 예측 섹션 */}
      {place && (
        <CongestionSection>
          <CongestionTitle>{place} 혼잡도 예측 (향후 14일)</CongestionTitle>
          {renderCongestionChart()}
        </CongestionSection>
      )}
    </PageContainer>
  );
};

export default CreateTripPage;
