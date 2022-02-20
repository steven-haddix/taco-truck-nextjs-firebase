import { Box, Center, Container, Grid, Text } from "@mantine/core";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { useUser } from "../../../context/userContext";
import IPointEvent from "../../../types/IPointEvent";
import Totals from "../../../types/IPointTotals";
import IPointTotals from "../../../types/IPointTotals";
import Bar from "../../../components/Bar";

const LeaderboardContainer = styled(Container)`
  background-color: #2b3245;
  color: white;
  padding: 0 0 20px 0;
  max-height: 90vh;
  overflow: hidden;

  border-radius: 5px;
  -moz-border-radius: 5px;
  -webkit-border-radius: 5px;

  box-shadow: 0px 10px 10px -2px rgba(0, 0, 0, 0.3);
  -webkit-box-shadow: 0px 10px 10px -2px rgba(0, 0, 0, 0.3);
  -moz-box-shadow: 0px 10px 10px -2px rgba(0, 0, 0, 0.3);
`;

const Header = styled.div`
  background: #2b3245;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 7px 7px 0px 0px;
  padding: 20px;

  display: flex;
  align-content: center;
  justify-content: space-between;
  position: relative;
`;

const HeaderText = styled(Text)`
  font-size: 36px;
`;

const Body = styled.div`
  padding: 0 20px;
  margin: 0px 0 0 0;
`;

const Record = styled.div`
  display: flex;
  flex-direction: row;
  font-size: 16px;
  height: 50px;
`;

const Title = styled.div`
  justify-self: center;
  align-self: center;
  padding: 0 5px 0 0;
  width: 20%;
`;

const BarContainer = styled.div`
  width: 80%;
`;

const BarLabel = styled.div`
    align-items: center;
    height: 100%;
    justify-content: flex-end;
    display: flex;
    text-align: center;
    align-items: center
    padding: 0 10px 0 0;
`;

interface ISortedTotal {
  id: string;
  total: number;
}
interface IScoreBoard {
  totals: ISortedTotal[];
  events: IPointEvent[];
}

const DashboardPage = () => {
  const { loadingUser, user } = useUser();
  const [scores, setScores] = useState<IScoreBoard>({
    totals: [],
    events: [],
  });

  const getScores = async () => {
    const scoresRes = await fetch("/api/scores/default", {
      headers: {
        Authorization: user?.token || "",
      },
    });
    const scoreData = await scoresRes.json();

    const sortedTotals = sortedScoreTotals(scoreData.scores);
    setScores({
      totals: sortedTotals,
      events: scoreData.events,
    });
  };

  const sortedScoreTotals = (totals: IPointTotals): ISortedTotal[] => {
    return Object.keys(totals)
      .sort((cur, next) => {
        return totals[cur] < totals[next] ? 1 : -1;
      })
      .map((key) => {
        return { id: key, total: totals[key] };
      });
  };

  useEffect(() => {
    if (!loadingUser) {
      getScores();
    }
  }, [loadingUser]);

  return (
    <LeaderboardContainer>
      <Grid>
        <Grid.Col span={12}>
          <Center my={15}>
            <Text size="xl">Leader Board</Text>
          </Center>
        </Grid.Col>
      </Grid>
      <Body>
        {scores &&
          scores.totals &&
          scores.totals.map((score, idx) => {
            return (
              <Record key={score.id} className="record">
                <Title>{score.id}</Title>
                <BarContainer>
                  <Bar
                    percent={(score.total / scores.totals[0].total) * 100}
                    colorIndex={idx}
                  >
                    <BarLabel>
                      {score.total}
                      <span aria-label="taco" role="img">
                        🌮
                      </span>
                    </BarLabel>
                  </Bar>
                </BarContainer>
              </Record>
            );
          })}
      </Body>
    </LeaderboardContainer>
  );
};

export default DashboardPage;
