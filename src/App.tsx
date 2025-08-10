import './App.scss';
import ParetoChartSimple from './components/ParetoChart/ParetoChartSimple';
import { useTheme } from './hooks';

export default function App() {
  const { bgColor } = useTheme();
  return <ParetoChartSimple bgColor={bgColor}/>
}