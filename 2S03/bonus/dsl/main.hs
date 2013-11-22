{-# LANGUAGE ExtendedDefaultRules #-}

import Prelude hiding ((+),(*),(==))
import qualified Prelude as P

import DSL


z = prettyPrint (1+2)

--x = 1
--y = 2 :: Double
--z = prettyPrint (1 + 2)
--y = 2
--z = 'x'


main = putStrLn (show (d(1 + 2 + 'x') "x" 3))