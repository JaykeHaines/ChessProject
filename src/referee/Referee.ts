import {
  Piece,
  PieceType,
  Position,
  samePosition,
  TeamType,
} from "../Constants.ts";

export default class Referee {
  tileIsBoth(position: Position, boardState: Piece[], team: TeamType) {
    return (
      !this.tileIsOccupied(position, boardState) ||
      this.tileIsOccupiedByOpponent(position, boardState, team)
    );
  }
  tileIsOccupied(position: Position, boardState: Piece[]): boolean {
    const piece = boardState.find((p) => samePosition(p.position, position));
    if (piece) {
      return true;
    } else {
      return false;
    }
  }

  tileIsOccupiedByOpponent(
    position: Position,
    boardState: Piece[],
    team: TeamType,
  ): boolean {
    return boardState.some(
      (p) => samePosition(p.position, position) && p.team !== team,
    );
  }

  isEnPassantMove(
    initialPosition: Position,
    desiredPosition: Position,
    type: PieceType,
    team: TeamType,
    boardState: Piece[],
  ) {
    const pawnDirection = team === TeamType.OUR ? 1 : -1;

    if (type === PieceType.PAWN) {
      if (
        (desiredPosition.x - initialPosition.x === -1 ||
          desiredPosition.x - initialPosition.x === 1) &&
        desiredPosition.y - initialPosition.y === pawnDirection
      ) {
        const piece = boardState.find(
          (p) =>
            p.position.x === desiredPosition.x &&
            p.position.y === desiredPosition.y - pawnDirection &&
            p.enPassant,
        );
        if (piece) {
          return true;
        }
      }
    }

    return false;
  }

  isValidMove(
    initialPosition: Position,
    desiredPosition: Position,
    type: PieceType,
    team: TeamType,
    boardState: Piece[],
  ) {
    if (type === PieceType.PAWN) {
      const specialRow = team === TeamType.OUR ? 1 : 6;
      const pawnDirection = team === TeamType.OUR ? 1 : -1;

      //MOVE LOGIC
      if (
        initialPosition.x === desiredPosition.x &&
        initialPosition.y === specialRow &&
        desiredPosition.y - initialPosition.y === 2 * pawnDirection
      ) {
        if (
          !this.tileIsOccupied(desiredPosition, boardState) &&
          !this.tileIsOccupied(
            { x: desiredPosition.x, y: desiredPosition.y - pawnDirection },
            boardState,
          )
        ) {
          return true;
        }
      } else if (
        initialPosition.x === desiredPosition.x &&
        desiredPosition.y - initialPosition.y === pawnDirection
      ) {
        if (!this.tileIsOccupied(desiredPosition, boardState)) {
          return true;
        }
      }

      //ATTACK LOGIC
      else if (
        desiredPosition.x - initialPosition.x === -1 &&
        desiredPosition.y - initialPosition.y === pawnDirection
      ) {
        console.log("upper / bottom left");
        if (this.tileIsOccupiedByOpponent(desiredPosition, boardState, team)) {
          return true;
        }
      } else if (
        desiredPosition.x - initialPosition.x === 1 &&
        desiredPosition.y - initialPosition.y === pawnDirection
      ) {
        console.log("upper / bottom right");
        if (this.tileIsOccupiedByOpponent(desiredPosition, boardState, team)) {
          return true;
        }
      }
    } else if (type === PieceType.KNIGHT) {
      //MOVING LOGIC FOR KNIGHT
      //8 different moving patterns

      for (let i = -1; i < 2; i += 2) {
        for (let j = -1; j < 2; j += 2) {
          if (desiredPosition.y - initialPosition.y === 2 * i) {
            if (desiredPosition.x - initialPosition.x === j) {
              if (this.tileIsBoth(desiredPosition, boardState, team)) {
                return true;
              }
              console.log("UPPER/BOTTOM LEFT");
            }
          }
          if (desiredPosition.x - initialPosition.x === 2 * i) {
            if (desiredPosition.y - initialPosition.y === j) {
              if (this.tileIsBoth(desiredPosition, boardState, team)) {
                return true;
              }
              console.log("RIGHT/LEFT TOP");
            }
          }
        }
      }
    } else if (type === PieceType.BISHOP) {
      //Movement and attack logic for the bishop
      //Top right move
      for (let i = 1; i < 8; i++) {
        if (
          desiredPosition.x > initialPosition.x &&
          desiredPosition.y > initialPosition.y
        ) {
          const passedPosition: Position = {
            x: initialPosition.x + i,
            y: initialPosition.y + i,
          };
          if (this.tileIsOccupied(passedPosition, boardState)) {
            console.log("Illegal move!");
            break;
          }
        }
        if (
          desiredPosition.x - initialPosition.x === i &&
          desiredPosition.y - initialPosition.y === i
        ) {
          return true;
        }
        //Bottom right move
        if (
          desiredPosition.x > initialPosition.x &&
          desiredPosition.y < initialPosition.y
        ) {
          const passedPosition: Position = {
            x: initialPosition.x + i,
            y: initialPosition.y - i,
          };
          if (this.tileIsOccupied(passedPosition, boardState)) {
            console.log("Illegal move!");
            break;
          }
        }
        if (
          desiredPosition.x - initialPosition.x === i &&
          desiredPosition.y - initialPosition.y === -i
        ) {
          return true;
        }
        //Bottom left move
        if (
          desiredPosition.x < initialPosition.x &&
          desiredPosition.y < initialPosition.y
        ) {
          const passedPosition: Position = {
            x: initialPosition.x - i,
            y: initialPosition.y - i,
          };
          if (this.tileIsOccupied(passedPosition, boardState)) {
            console.log("Illegal move!");
            break;
          }
        }
        if (
          desiredPosition.x - initialPosition.x === -i &&
          desiredPosition.y - initialPosition.y === -i
        ) {
          return true;
        }
        if (
          desiredPosition.x < initialPosition.x &&
          desiredPosition.y > initialPosition.y
        ) {
          const passedPosition: Position = {
            x: initialPosition.x - i,
            y: initialPosition.y + i,
          };
          if (this.tileIsOccupied(passedPosition, boardState)) {
            console.log("Illegal move!");
            break;
          }
        }

        if (
          desiredPosition.x - initialPosition.x === -i &&
          desiredPosition.y - initialPosition.y === i
        ) {
          return true;
        }
      }
    }
    return false;
  }
}
