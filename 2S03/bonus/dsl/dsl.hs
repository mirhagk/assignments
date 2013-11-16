--NOT FOR ASSIGNMENT FOR THE LOLZ
module DSL where

import Prelude hiding ((+),(*),(==))
import qualified Prelude as P


data Expr = Null
  | Const Int
  | Var [Char]
  | Addition Expr Expr
  | Mult Expr Expr

class Mathable a where
	(+) :: (Mathable b) => a -> b -> Expr
	(*) :: (Mathable b) => a -> b -> Expr
	toPoly :: a-> Expr
	(==) :: (Mathable b) => a-> b-> Bool
	x + y = Addition (toPoly x) (toPoly y)
	x * y = Mult (toPoly x) (toPoly y)
	x == y = eval (toPoly x) P.== eval (toPoly y)
--
--instance Eq Expr where
--	x == y = x `polyEqual` y

instance Mathable Expr where
	toPoly x = x

instance Mathable Int where
	toPoly x = (Const x)
	
--instance Mathable Integer where
--	toPoly x = (Const (fromInteger x))
	
instance Mathable Double where
	toPoly x = (Const (floor x))

instance Mathable Char where
	toPoly x = (Var [x])

--instance  Read Expr  where
--	readsPrec _ s = [(Var s, "")]
instance Show Expr where
	show = printPoly

infixl 7 *
infixl 6 +
	
--printPoly $ simplify $ diff (1 + 2 + 3 * (Var "x") * (Var "x") * (Var "y")) "x"
polyEqual x y = eval x == eval y

collectConstants :: Expr -> Expr
collectConstants (Addition p q) = case (collectConstants p, collectConstants q) of
                          (Const pc, Const qc) -> Const (pc P.+ qc)
                          (Const pc, Addition (Const qc) notConst) -> Addition (Const (pc P.+ qc)) notConst
                          (pNonConst, Addition (Const qc) qNonConst) -> Addition (Const qc) (Addition pNonConst qNonConst) -- New line
                          (nonConst, Const qc) -> Addition (Const qc) nonConst
                          (pNonConst, qNonConst) -> Addition pNonConst qNonConst
collectConstants (Mult p q) = case (collectConstants p, collectConstants q) of
                          (Const pc, Const qc) -> Const (pc P.* qc)
                          (Const pc, Mult (Const qc) notConst) -> Mult (Const (pc P.* qc)) notConst
                          (pNonConst, Mult (Const qc) qNonConst) -> Mult (Const qc) (Mult pNonConst qNonConst) -- New line
                          (nonConst, Const qc) -> Mult (Const qc) nonConst
                          (pNonConst, qNonConst) -> Mult pNonConst qNonConst
-- can't do anything with constants and variables
collectConstants x = x


-- we still need to print the answer
printPoly :: Expr -> String
printPoly (Const c) = show c
printPoly (Var v) = v -- turn a single Char into a String=[Char]
printPoly (Addition p q) = "(" ++ (printPoly p) ++ ") + (" ++ (printPoly q) ++ ")"
printPoly (Mult p q) = "(" ++ (printPoly p) ++ ") * (" ++ (printPoly q) ++ ")"

prettyPrint p = case (simplify p) of
				(Mult (Const c) (Var x)) -> show c ++ x
				(Const c) -> show c
				(Var x) -> x
				(Addition x y) -> "(" ++ (prettyPrint x) ++ ") + (" ++ (prettyPrint y) ++ ")"
				(Mult x y) -> "(" ++ (prettyPrint x) ++ ") * (" ++ (prettyPrint y) ++ ")"

--replace :: Char -> Double -> Expr -> Expr
replace x y (Var v) = if v P.== x then (Const y) else (Var v)
replace x y (Addition p q) = Addition (replace x y p) (replace x y q)
replace x y (Mult p q) = Mult (replace x y p) (replace x y q)
replace x y p = p

eval (Var x) = error "Cant' evaluate expressions with variables in them"
eval (Const x) = x
eval (Addition p q) = eval p P.+ eval q
eval (Mult p (Const 0)) = 0
eval (Mult (Const 0) q) = 0
eval (Mult p q) = eval p P.* eval q


simplify :: Expr -> Expr
simplify (Addition p q) = case (simplify p, simplify q) of
                          (Const 0, x) -> x
                          (x, Const 0) -> x
                          (Const pc, Const qc) -> Const (pc P.+ qc)
                          (Var pv, Var qv) -> if pv P.== qv then simplify (Mult (Var pv) (Const 2)) else Addition (Var pv) (Var qv)
                          (Const pc, Addition (Const qc) notConst) -> Addition (Const (pc P.+ qc)) notConst
                          (pNonConst, Addition (Const qc) qNonConst) -> Addition (Const qc) (Addition pNonConst qNonConst) -- New line
                          (nonConst, Const qc) -> Addition (Const qc) nonConst
                          (pNonConst, qNonConst) -> Addition pNonConst qNonConst
simplify (Mult p q) = case (simplify p, simplify q) of
                          (Const 0, _) -> Const 0
                          (_, Const 0) -> Const 0
                          (Const 1, x) -> x
                          (x, Const 1) -> x
                          (Const pc, Const qc) -> Const (pc P.* qc)
                          (Const pc, Mult (Const qc) notConst) -> Mult (Const (pc P.* qc)) notConst
                          (pNonConst, Mult (Const qc) qNonConst) -> Mult (Const qc) (Mult pNonConst qNonConst) -- New line
                          (nonConst, Const qc) -> Mult (Const qc) nonConst
                          (pNonConst, qNonConst) -> Mult pNonConst qNonConst
simplify p = p

diff (Const x) dx =  Const 0
diff (Var x) dx = if (x P.== dx) then Const 1 else (Var x)
diff (Addition x y) dx = Addition (diff x dx) (diff y dx)
diff (Mult x y)dx  = Addition (Mult (diff x dx) (y)) (Mult (x) (diff y dx))

d p v x = eval $ replace v x (simplify (diff p v))
	
polyX :: [Int] -> Expr
polyX coeffs = polyHelper $ map Const $ reverse coeffs

polyHelper :: [Expr] -> Expr
polyHelper [x] = x
polyHelper (x:xs) = (Addition x (Mult (Var "x") (polyHelper xs)))