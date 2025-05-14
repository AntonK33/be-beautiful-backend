import { getStatisticsSercices } from "../services/statistics.js"; 

export const getStatisticsController = async (req, res) => {
  const userId = req.user._id;
  const { start, end } = req.query;
  
  const data = await getStatisticsSercices(userId,start, end);

  res.status(200).json({
    status: 200,
      message: 'Successfully found transactions!',
    
    data,
  });
}; 
