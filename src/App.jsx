import axios from "axios";
import { useState } from "react";
import { useCallback } from "react";

export default function App() {
  const url = "https://leetcode.com/graphql";
  const appTitle = "mleet";
  const [text, setText] = useState("");
  const headers = {
    "Content-Type": "application/json",
    Authorization: "Bearer YOUR_TOKEN_HERE",
  };
  const query = `
  query getUserProfile($username: String!) {
    allQuestionsCount {
      difficulty
      count
    }
    matchedUser(username: $username) {
      contributions {
        points
      }
      profile {
        reputation
        ranking
      }
      submissionCalendar
      submitStats {
        acSubmissionNum {
          difficulty
          count
          submissions
        }
        totalSubmissionNum {
          difficulty
          count
          submissions
        }
      }
    }
    recentSubmissionList(username: $username) {
      title
      titleSlug
      timestamp
      statusDisplay
      lang
      __typename
    }
    matchedUserStats: matchedUser(username: $username) {
      submitStats: submitStatsGlobal {
        acSubmissionNum {
          difficulty
          count
          submissions
          __typename
        }
        totalSubmissionNum {
          difficulty
          count
          submissions
          __typename
        }
        __typename
      }
    }
  }
`;
  const formatData = (data) => {
    return {
      totalSolved: data.matchedUser.submitStats.acSubmissionNum[0].count,
      totalSubmissions: data.matchedUser.submitStats.totalSubmissionNum,
      totalQuestions: data.allQuestionsCount[0].count,
      easySolved: data.matchedUser.submitStats.acSubmissionNum[1].count,
      totalEasy: data.allQuestionsCount[1].count,
      mediumSolved: data.matchedUser.submitStats.acSubmissionNum[2].count,
      totalMedium: data.allQuestionsCount[2].count,
      hardSolved: data.matchedUser.submitStats.acSubmissionNum[3].count,
      totalHard: data.allQuestionsCount[3].count,
      ranking: data.matchedUser.profile.ranking,
      contributionPoint: data.matchedUser.contributions.points,
      reputation: data.matchedUser.profile.reputation,
      submissionCalendar: JSON.parse(data.matchedUser.submissionCalendar),
      recentSubmissions: data.recentSubmissionList,
      matchedUserStats: data.matchedUser.submitStats,
    };
  };

  const Card = ({ cardTitle }) => {
    return (
      <div className="card w-1/4 bg-emerald-600 p-4 text-center text-white">
        <h1 className="font-bold text-xl card-title">{cardTitle}</h1>
      </div>
    );
  };

  const handleChange = (e) => {
    setText(e.target.value);
  };
  const handleSubmit = (e) => {
    e.preventDefault();

    axios
      .post(
        `${url}`,
        { query: query, variables: { username: text } },
        { headers: headers }
      )
      .then((result) => result.json())
      .then((data) => {
        if (data.errors) {
          // res.send(data);
        } else {
          // res.send(formatData(data.data));
        }
      })
      .catch((err) => {
        console.error("Error", err);
        // res.send(err);
      });
  };

  // useCallback(() => {}, []);

  return (
    <div className="p-4">
      <h1 className="text-3xl text-center font-bold uppercase">{appTitle}</h1>

      <div className="m-4 flex text-center justify-center items-center">
        <textarea
          className="border-black border-2 px-1 rounded-md"
          placeholder="user-id"
          name="user-id"
          id="user-id"
          cols="30"
          rows="1"
          value={text}
          onChange={handleChange}
        ></textarea>

        <button
          className="px-2 py-1 rounded-md text-sm text-white font-bold bg-black m-2"
          onClick={handleSubmit}
        >
          Submit
        </button>
      </div>

      <Card cardTitle="Profile"></Card>
    </div>
  );
}
