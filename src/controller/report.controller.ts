import { RequestHandler } from 'express';
import { Ok, BadRequest } from '../helper/error.response';
import { Order } from '../models/order.model';
import { ObjectId } from 'mongodb';

// all orders of a user and how many spent mony .
export const viewAllOrdersOfPerticularUser: RequestHandler = async (
  request,
  response
) => {
  try {
    let userId = request.body.userId;
    if (!userId) {
      return BadRequest(response, { message: 'User ID is required' });
    }
    let user_id = new ObjectId(userId);
    let user = await Order.aggregate([
      {
        $match: { user_id: user_id },
      },
      {
        $group: {
          _id: {
            user_id: '$user_id',
          },
          totalOrders: { $sum: 1 },
          totalAmountSpent: { $sum: '$total_amount' },
        },
      },
    ]);

    if (user.length === 0) {
      return Ok(response, 'No orders found for this user', {});
    }
    return Ok(response, 'user details fetched successfully', user);
  } catch (error: any) {
    return BadRequest(response, { message: error.message });
  }
};

export const viewOrderWithDateRange: RequestHandler = async (
  request,
  response
) => {
  try {
    let { fromDate, toDate } = request.body;
    let newFromDate = new Date(fromDate);
    let newToDate = new Date(toDate);

    const rangeData = await Order.find({
      order_date: { $gte: newFromDate, $lte: newToDate },
    });
    return Ok(response, 'order fetched successfully', rangeData);
  } catch (error: any) {
    return BadRequest(response, { message: error.message });
  }
};

export const viewOrderReport: RequestHandler = async (request, response) => {
  try {
    let { type } = request.body;
    let criteria: any = {};
    if (type === 'daily') {
      criteria = [
        {
          $match: {
            order_date: {
              $gte: new Date(new Date().setHours(0, 0, 0, 0)),
              $lte: new Date(new Date().setHours(23, 59, 59, 999)),
            },
          },
        },
        {
          $group: {
            _id: {
              user_id: '$user_id',
            },
            count: { $sum: 1 },
            totalAmount: { $sum: '$total_amount' },
          },
        },
      ];
      const data = await Order.aggregate(criteria);
      return Ok(response, 'daily order report fetched successfully', data);
    } else if (type === 'weekly') {
      const today = new Date();

      const startOfWeek = new Date(
        today.setDate(today.getDate() - today.getDay())
      );
      startOfWeek.setHours(0, 0, 0, 0);

      const endOfWeek = new Date(
        today.setDate(today.getDate() - today.getDay() - 6)
      );
      endOfWeek.setHours(23, 59, 59, 999);
      criteria = [
        {
          $match: {
            order_date: {
              $gte: endOfWeek,
              $lt: startOfWeek,
            },
          },
        },
        {
          $group: {
            _id: null,
            count: { $sum: 1 },
            totalAmount: { $sum: '$total_amount' },
          },
        },
      ];
    } else if (type === 'monthly') {
      const endDate = new Date();

      const startDate = new Date();
      startDate.setMonth(startDate.getMonth() - 1);
      startDate.setHours(0, 0, 0, 0);
      endDate.setHours(23, 59, 59, 999); // End of today

      const generateDateRange = (startDate: any, endDate: any) => {
        const dates = [];
        let currentDate = new Date(startDate);
        while (currentDate <= endDate) {
          dates.push(new Date(currentDate));
          currentDate.setDate(currentDate.getDate() + 1);
        }
        return dates;
      };

      let allDates = generateDateRange(startDate, endDate);

      criteria = [
        {
          $match: {
            order_date: {
              $gte: startDate,
              $lt: endDate,
            },
          },
        },
        {
          $group: {
            _id: {
              day: { $dayOfMonth: '$order_date' },
              month: { $month: '$order_date' },
              year: { $year: '$order_date' },
            },
            count: { $sum: 1 },
            totalAmount: { $sum: '$total_amount' },
          },
        },
        {
          $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 },
        },
      ];
      const data = await Order.aggregate(criteria);

      // Create a map of the results with dates as keys
      const resultMap = data.reduce((acc, entry) => {
        const dateKey = `${entry._id.year}-${entry._id.month}-${entry._id.day}`;
        acc[dateKey] = entry;
        return acc;
      }, {});

      // Merge the results with allDates
      const finalResults = allDates.map((date) => {
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();
        const dateKey = `${year}-${month}-${day}`;

        if (resultMap[dateKey]) {
          return resultMap[dateKey];
        } else {
          return {
            _id: { day, month, year },
            count: 0,
            totalAmount: 0,
          };
        }
      });
      return Ok(response, `${type} order fetched successfully`, finalResults);
    }
    const data = await Order.aggregate(criteria);
    return Ok(response, `${type} order fetched successfully`, data);
  } catch (error: any) {
    return BadRequest(response, { message: error.message });
  }
};
