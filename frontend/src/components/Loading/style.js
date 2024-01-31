import styled from "styled-components";
import * as Colors from "../../constants/colors";

export const LoadingStyled = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 60vh;
  .loading-spinner {
    width: 50px;
    height: 50px;
    border: 3px solid #f3f3f3;
    border-radius: 50%;
    border-top-color: ${Colors.DARK_BLUE};
    animation: spin 2s linear infinite;
  }
  .loading-message {
    font-size: 2rem;
    color: ${Colors.DARK_BLUE};
    text-align: center;
    margin-top: 1rem;
  }
  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;
